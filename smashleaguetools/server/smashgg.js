const fs = require('fs');
const User = require('./models/user.model');
const axios = require('axios');
const constructGGPlayer = require('./matches').constructGGPlayer;
const createMatch = require('./matches').createMatch;
const endMatch = require('./matches').endMatch;
const matches = require('./matches').matches;
const endedMatches = new Set();

const defaultTournamentInfo = {
    phaseGroupId: undefined,
    tournamentName: undefined,
    bracketLink: undefined,
    signupLink: undefined
}
var tournamentInfo = defaultTournamentInfo;
var currentTournamentId = undefined;
const getTournamentInfo = () => {
   return tournamentInfo
}

const initFromJson = () => {
    fs.readFile('./tournament.json', (err, data) => {
        if (err) throw err;
        const info = JSON.parse(data);
        if(!info.phaseGroupId || info.phaseGroupId === '') {
            tournamentInfo = defaultTournamentInfo;
            return;
        }

        queryTournament(info.phaseGroupId, (tournament) => {
            const eventSlug = tournament.phaseGroup.phase.event.slug;
            const urlPhaseId = tournament.phaseGroup.phase.id;

            tournamentInfo = {
                phaseGroupId: tournament.phaseGroup.id,
                tournamentName: tournament.phaseGroup.phase.event.tournament.name,
                bracketLink: 'https://smash.gg/' + eventSlug + '/brackets/' + urlPhaseId + '/' + tournament.phaseGroup.id,
                signupLink: tournament.phaseGroup.phase.event.tournament.url
            }

            if(info.tournamentStarted)
                startTournament();
        });
    })
}
initFromJson();

const setTournament = (phaseGroupId) => {
    fs.writeFile('./tournament,json', { phaseGroupId }, (err) => {
        if (err) throw err;
        initFromJson();
    });
}

const startTournament = () => {
    console.log('Starting tournament');
    if(tournamentInfo)
        currentTournamentId = tournamentInfo.phaseGroupId;
}

const endTournament = () => {
    currentTournamentId = undefined;
}

const queryTournament = (phaseGroupId, callback) => {
    const endpoint = 'https://api.smash.gg/gql/alpha';
    const options = {
        headers: {
            'Authorization' : 'Bearer ' + process.env.SMASHGG_KEY
        }
    }
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
        callback.log(error);
    })
}

const queryMatches = (phaseGroupId, callback) => {
    const endpoint = 'https://api.smash.gg/gql/alpha';
    const options = {
        headers: {
            'Authorization' : 'Bearer ' + process.env.SMASHGG_KEY
        }
    }
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
        //console.log('Polling ' + currentTournamentId)
        
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
    getTournamentInfo: getTournamentInfo
};