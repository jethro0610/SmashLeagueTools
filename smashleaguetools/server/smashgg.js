const axios = require('axios');
const constructGGPlayer = require('./matches').constructGGPlayer;
const createMatch = require('./matches').createMatch;
const endMatch = require('./matches').endMatch;
const matches = require('./matches').matches;
const endedMatches = new Set();

var testPlayer = constructGGPlayer('','','');
var currentTournamentId = undefined;

const startTournament = (phaseGroupId) => {
    currentTournamentId = phaseGroupId.toString();
}

const endTournament = () => {
    currentTournamentId = undefined;
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
                                    id
                                    gamerTag
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
    queryMatches(currentTournamentId, ggMatches => {
        //console.log('Polling ' + currentTournamentId)
        
        for(const ggMatch of ggMatches) {
            if(ggMatch.startedAt != null) {
                if (endedMatches.has(ggMatch.id)) continue; // Skip match if it's already ended

                if (!ggMatch.winnerId) {
                    if (matches.has(ggMatch.id)) continue; // Skip match if it's already active
                    const player1 = constructGGPlayer(
                        ggMatch.slots[0].entrant.id, 
                        ggMatch.slots[0].entrant.participants[0].player.id,
                        ggMatch.slots[0].entrant.participants[0].player.gamerTag
                    );
                    
                    const player2 = constructGGPlayer(
                        ggMatch.slots[1].entrant.id, 
                        ggMatch.slots[1].entrant.participants[0].player.id,
                        ggMatch.slots[1].entrant.participants[0].player.gamerTag
                    );
                    createMatch(ggMatch.id, player1, player2);
                    console.log('Created match')
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
                    console.log('Match ended');
                }
            }
        }
        
    });
}

setInterval(() => {
    if (!currentTournamentId)
        return;

    pollMatches();
}, 1000);

module.exports = { 
    startTournament: startTournament,
    endTournament: endTournament
};