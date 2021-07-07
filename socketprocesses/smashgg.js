const User = require('../models/user.model');
const Tournament = require('../models/tournament.model');
const EventEmitter = require('events');
const axios = require('axios');
const constructGGPlayer = require('./matches').constructGGPlayer;
const createMatch = require('./matches').createMatch;
const clearMatches = require('./matches').clearMatches;
const endMatch = require('./matches').endMatch;
const matches = require('./matches').matches;

const endedMatches = new Set(); // Stores all the matches that have been completed
const ggEvents = new EventEmitter();

const endpoint = 'https://api.smash.gg/gql/alpha';
const options = {
    headers: {
        'Authorization' : 'Bearer ' + process.env.SMASHGG_KEY
    }
}

// Information about the tournament
var queryTournamentId = undefined; // ID for querying smash.gg
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

// Return exports
const getTournamentInfo = () => { return tournamentInfo };
const isTournamentStarted = () => { return (queryTournamentId !== undefined)};

// Initialize the tournament info from the MongoDB database
const initFromMongo = () => {
    Tournament.findOne({}).then(tournament => {
        tournamentInfo = tournament;
        if (tournamentInfo.started)
            startTournament();
    })
}

const setTournament = (phaseGroupId, callback) => {
    tournamentDataFromId(phaseGroupId, tournamentData => {
        // Data to set in the database
        const updateData = {
            phaseGroupId,
            started: false,
            bracketUrl: tournamentData.bracketUrl,
            registerUrl: tournamentData.registerUrl,
            name: tournamentData.name
        }

        // Update the tournament info in the database
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
    // Info to update the title card
    const updateData = {
        titleCard,
        subtitleCard,
        hasRegistration
    }

     // Update the title card info in the database
    Tournament.findOneAndUpdate({}, updateData, {new: true}, (err, tournament) => {
        tournamentInfo = tournament;
        if(callback)
            callback(tournamentInfo);
    });
}

const startTournament = () => {
    if(!tournamentInfo.phaseGroupId) return; // Ensure there's an ID assigned

    // Get the information from MongoDB and flag it as started
    Tournament.findOneAndUpdate({}, {started: true}, {new: true}, (err, tournament) => {
        if(err)
            console.log(err);

        // Set the information to start the tournament
        tournamentInfo = tournament;
        queryTournamentId = tournamentInfo.phaseGroupId;
        console.log('Starting tournament ' + tournamentInfo.name);
        ggEvents.emit('tournament-started');
    });
}

const endTournament = () => {
    // Get the tournament from MongoDB and flag it as ended
    Tournament.findOneAndUpdate({}, {started: false}, {new: true}, (err, tournament) => {
        if(err)
            console.log(err);
        tournamentInfo = tournament;
        queryTournamentId = undefined;
        clearMatches();
        endedMatches.clear();
        console.log('Ending tournament ' + tournamentInfo.name);
        ggEvents.emit('tournament-ended');
    });
}

// Query the tournament in SmashGG
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

// Query tournament from SmashGG and send back the data
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

// Query the ongoing tournament matches in smash.gg
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

// Poll the matches every interval and update accordingly
const pollMatches = () => {
    queryMatches(queryTournamentId, async ggMatches => {
        for(const ggMatch of ggMatches) {
            if(ggMatch.startedAt != null) {
                if (endedMatches.has(ggMatch.id)) continue; // Skip match if it's already ended

                if (!ggMatch.winnerId) {
                    if (matches.has(ggMatch.id)) continue; // Skip match if it's already active

                    // Find a MongoDB user linked to the ggSlug, and create a player
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

// Poll the tournament matches
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