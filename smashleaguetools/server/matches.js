
class GGPlayer {
    constructor(ggId, name) {
        this.ggId = ggId;
        this.name = name;
    }
}

class Bet {
    constructor(mongoId, predictedNumber, amount) {
        this.mongoId = mongoId;
        this.predictedNumber = predictedNumber;
        this.amount = amount;
    }
}

class Match {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.bets = [];
    }

    getBets(playerNumber) {
        var amount = 0;
        for (const bet of this.bets) {
            if(bet.predictedNumber == playerNumber)
                amount += bet.amount;
        }
        return amount;
    }

    getTotalBets() {
        var amount = 0;
        for (const bet of this.bets)
            amount += bet.amount;
        return amount;
    }
}

const EventEmitter = require('events');

matches = new Map();
const matchEvents = new EventEmitter();

function createMatch(player1, player2) {
    var key = Math.random().toString(36).substr(2, 5);
    var match = new Match(player1, player2);
    matches.set(key, match);
    matchEvents.emit('match-created', key);
}

function createMatchFromNames(player1Name, player2Name) {
    createMatch(new GGPlayer('', player1Name), new GGPlayer('', player2Name));
}

function updateMatch(key, amount1, amount2) {
    var matchToUpdate = matches.get(key);
    if(!matchToUpdate)
        return;

    matchToUpdate.bets.push(new Bet('', 1, amount1));
    matchToUpdate.bets.push(new Bet('', 2, amount2));

    console.log(matchToUpdate);
    matchEvents.emit('match-updated', key);
}

module.exports = { 
    matches: matches, 
    matchEvents: matchEvents,
    createMatchFromNames: createMatchFromNames,
    updateMatch: updateMatch
};