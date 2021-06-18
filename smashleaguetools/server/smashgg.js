const fs = require('fs');
const User = require('./models/user.model');
const EventEmitter = require('events');
const axios = require('axios');
const constructGGPlayer = require('./matches').constructGGPlayer;
const createMatch = require('./matches').createMatch;
const clearMatches = require('./matches').clearMatches;
const endMatch = require('./matches').endMatch;
const matches = require('./matches').matches;

const endedMatches = new Set();
const ggEvents = new EventEmitter();

const endpoint = 'https://api.smash.gg/gql/alpha';
const options = {
    headers: {
        'Authorization' : 'Bearer ' + process.env.SMASHGG_KEY
    }
}

const defaultTournamentInfo = {
    phaseGroupId: undefined,
    tournamentName: undefined,
    bracketLink: undefined,
    signupLink: undefined
}
var tournamentInfo = defaultTournamentInfo;
var currentTournamentId = undefined;
const getTournamentInfo = () => {return tournamentInfo}
const isTournamentStarted = () => {return currentTournamentId !== undefined}

const initFromJson = () => {
    fs.readFile('./tournament.json', (err, data) => {
        if (err) throw err;
        const info = JSON.parse(data);
        if(!info.phaseGroupId || info.phaseGroupId === '') {
            tournamentInfo = defaultTournamentInfo;
            return;
        }

        tournamentInfoFromId(info.phaseGroupId, () => {
            if(info.tournamentStarted === true)
                startTournament();
        });
    })
}
initFromJson();

const setTournament = (phaseGroupId, callback) => {
    const info = {
        phaseGroupId: phaseGroupId, 
        tournamentStarted: false
    }
    tournamentInfoFromId(phaseGroupId, tournament => {
        tournamentInfo = tournament;

        if (callback)
            callback(tournament);
    });
    fs.writeFile('./tournament.json', JSON.stringify(info, null, 2), (err) => {
        if (err) throw err;
    });
}

const startTournament = () => {
    if(!tournamentInfo.phaseGroupId) return;
    const info = {
        phaseGroupId: tournamentInfo.phaseGroupId,
        tournamentStarted: true
    }
    fs.writeFile('./tournament.json', JSON.stringify(info, null, 2), (err) => {
        if (err) throw err;
    });
    currentTournamentId = tournamentInfo.phaseGroupId;
    console.log('Starting tournament ' + tournamentInfo.tournamentName);
    ggEvents.emit('tournament-started');
}

const endTournament = () => {
    const info = {
        phaseGroupId: tournamentInfo.phaseGroupId,
        tournamentStarted: false
    }
    fs.writeFile('./tournament.json', JSON.stringify(info, null, 2), (err) => {
        if (err) throw err;
    });
    currentTournamentId = undefined;
    clearMatches();
    endedMatches.clear();
    ggEvents.emit('tournament-ended');
}

const queryTournament = (phaseGroupId, callback) => {
    const query = 
    `{
        phaseGroup(id: "${phaseGroupId}"){
            id
            phase {
                id
                event {
                    slug
                    tournament {
                        name
                        url(relative: false)
                    }
                }
            }
        }
    }`
    axios.post(endpoint, {query: query}, options).then(res => {
        callback(res.data.data);
    })
    .catch(error => {
        console.log(error);
    })
}

const tournamentInfoFromId = (phaseGroupId, callback) => { 
    queryTournament(phaseGroupId, (tournament) => {
        const eventSlug = tournament.phaseGroup.phase.event.slug;
        const urlPhaseId = tournament.phaseGroup.phase.id;

        tournamentInfo = {
            phaseGroupId: tournament.phaseGroup.id,
            tournamentName: tournament.phaseGroup.phase.event.tournament.name,
            bracketLink: 'https://smash.gg/' + eventSlug + '/brackets/' + urlPhaseId + '/' + tournament.phaseGroup.id,
            signupLink: tournament.phaseGroup.phase.event.tournament.url
        }
        callback(tournamentInfo);
    });
}

const queryMatches = (phaseGroupId, callback) => {
    const query = 
    `{
        phaseGroup(id: "${phaseGroupId}"){
            sets {
                nodes {
                    id
                    startedAt
                    winnerId
                    slots {
                        entrant {
                            id
                            participants {
                                player {
                                    gamerTag
                                    user {
                                        slug
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }`
    
    axios.post(endpoint, {query: query}, options).then(res => {
        callback(res.data.data.phaseGroup.sets.nodes)
    })
    .catch(error => {
        console.log(error);
    })
}

const pollMatches = () => {
    queryMatches(currentTournamentId, async ggMatches => {
        for(const ggMatch of ggMatches) {
            if(ggMatch.startedAt != null) {
                if (endedMatches.has(ggMatch.id)) continue; // Skip match if it's already ended

                if (!ggMatch.winnerId) {
                    if (matches.has(ggMatch.id)) continue; // Skip match if it's already active
                    const player1User = await User.findOne({ggSlug: ggMatch.slots[0].entrant.participants[0].player.user.slug}).exec();

                    const player1 = constructGGPlayer(
                        ggMatch.slots[0].entrant.id, 
                        ggMatch.slots[0].entrant.participants[0].player.gamerTag,
                        player1User === null ? undefined : player1User.id
                    );
                    
                    const player2User = await User.findOne({ggSlug: ggMatch.slots[1].entrant.participants[0].player.user.slug}).exec();
                    const player2 = constructGGPlayer(
                        ggMatch.slots[1].entrant.id, 
                        ggMatch.slots[1].entrant.participants[0].player.gamerTag,
                        player2User === null ? undefined : player2User.id
                    );
                    createMatch(ggMatch.id, player1, player2);
                }
                else { // End a match
                    const matchToEnd = matches.get(ggMatch.id);
                    if(!matchToEnd)
                        continue;

                    // Find the winning number
                    var winningNumber;
                    if (ggMatch.winnerId == matchToEnd.player1.ggSetId)
                        winningNumber = 1;
                    else
                        winningNumber = 2;

                    // Call the match to end
                    endMatch(ggMatch.id, winningNumber);
                    endedMatches.add(ggMatch.id);
                }
            }
        }
        
    });
}

setInterval(() => {
    if (!currentTournamentId)
        return;

    pollMatches();
}, 2000);

module.exports = { 
    startTournament: startTournament,
    endTournament: endTournament,
    initFromJson: initFromJson,
    setTournament: setTournament,
    getTournamentInfo: getTournamentInfo,
    isTournamentStarted: isTournamentStarted,
    ggEvents: ggEvents
};