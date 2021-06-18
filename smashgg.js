const User = require('./models/user.model');
const Tournament = require('./models/tournament.model');
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

var queryTournamentId = undefined;
var tournamentInfo = {
    phaseGroupId: undefined,
    name: undefined,
    started: undefined,
    titleCard: undefined,
    subtitleCard: undefined,
    hasRegistration:undefined,
    bracketUrl: undefined,
    registerUrl: undefined,
}

const getTournamentInfo = () => { return tournamentInfo };
const isTournamentStarted = () => { return (queryTournamentId !== undefined)};

const initFromMongo = () => {
    Tournament.findOne({}).then(tournament => {
        tournamentInfo = tournament;
    })
}

const setTournament = (phaseGroupId, callback) => {
    tournamentDataFromId(phaseGroupId, tournamentData => {
        const updateData = {
            phaseGroupId,
            started: false,
            bracketUrl: tournamentData.bracketUrl,
            registerUrl: tournamentData.registerUrl,
            name: tournamentData.name
        }
        Tournament.findOneAndUpdate({}, updateData, {new: true}, (err, tournament) => {
            if (err)
                console.log(err);

            tournamentInfo = tournament;
            if(callback)
                callback(tournamentInfo);
        });
    });
}

const setTitleCard = (titleCard, subtitleCard, hasRegistration, callback) => {
    const updateData = {
        titleCard,
        subtitleCard,
        hasRegistration
    }
    Tournament.findOneAndUpdate({}, updateData, {new: true}, (err, tournament) => {
        tournamentInfo = tournament;
        if(callback)
            callback(tournamentInfo);
    });
}

const startTournament = () => {
    if(!tournamentInfo.phaseGroupId) return;
    Tournament.findOneAndUpdate({}, {started: true}, {new: true}, (err, tournament) => {
        tournamentInfo = tournament;
        queryTournamentId = tournamentInfo.phaseGroupId;
        console.log('Starting tournament ' + tournamentInfo.tournamentName);
        ggEvents.emit('tournament-started');
    });
}

const endTournament = () => {
    Tournament.findOneAndUpdate({}, {started: true}, {new: true}, (err, tournament) => {
        tournamentInfo = tournament;
        queryTournamentId = undefined;
        clearMatches();
        endedMatches.clear();
        console.log('Ending tournament ' + tournamentInfo.tournamentName);
        ggEvents.emit('tournament-ended');
    });
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

const tournamentDataFromId = (phaseGroupId, callback) => { 
    queryTournament(phaseGroupId, (tournamentQuery) => {
        const eventSlug = tournamentQuery.phaseGroup.phase.event.slug;
        const urlPhaseId = tournamentQuery.phaseGroup.phase.id;

        const tournamentData = {
            name: tournamentQuery.phaseGroup.phase.event.tournament.name,
            bracketUrl: 'https://smash.gg/' + eventSlug + '/brackets/' + urlPhaseId + '/' + phaseGroupId,
            registerUrl: tournamentQuery.phaseGroup.phase.event.tournament.url + '/register'
        }
        callback(tournamentData);
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
    queryMatches(queryTournamentId, async ggMatches => {
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
    if (!queryTournamentId)
        return;

    pollMatches();
}, 2000);

module.exports = { 
    startTournament: startTournament,
    endTournament: endTournament,
    setTournament: setTournament,
    getTournamentInfo: getTournamentInfo,
    isTournamentStarted: isTournamentStarted,
    ggEvents: ggEvents,
    initFromMongo,
    setTitleCard
};