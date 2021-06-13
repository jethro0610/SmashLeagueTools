
class GGPlayer {
    constructor(ggId, name) {
        this.ggId = ggId;
        this.name = name;
    }
}

class Bet {
    constructor(mongoId, predictionNumber, amount) {
        this.mongoId = mongoId;
        this.predictionNumber = predictionNumber;
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
            if(bet.predictionNumber == playerNumber)
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

function addBet(key, mongoId, predictionNumber, amount) {
    var matchToUpdate = matches.get(key);
    if(!matchToUpdate)
        return;

    const newBet = new Bet(mongoId, predictionNumber, amount);

    matchToUpdate.bets.push(newBet);
    matchEvents.emit('match-updated', key);
}

module.exports = { 
    matches: matches, 
    matchEvents: matchEvents,
    createMatchFromNames: createMatchFromNames,
    addBet: addBet
};