const EventEmitter = require('events');

function constructGGPlayer (ggSetId, name, mongoId) {
    return { ggSetId, name, mongoId};
}

class Bet {
    constructor(predictionNumber, amount) {
        this.predictionNumber = predictionNumber;
        this.amount = amount;
    }
}

class Match {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.bets = new Map();
        this.startTime = Date.now();
    }

    getPlayer(playerNumber) {
        if(playerNumber == 1)
            return this.player1;
        if(playerNumber == 2)
            return this.player2;

        return 'Invalid Player';
    }

    getPlayerName(playerNumber) {
        if(playerNumber == 1)
            return this.player1.name;
        if(playerNumber == 2)
            return this.player2.name;

        return 'Invalid Player';
    }

    getBets(playerNumber) {
        var amount = 0;
        for (const bet of this.bets.values()) {
            if(bet.predictionNumber == playerNumber)
                amount += bet.amount;
        }
        return amount;
    }

    getTotalBets() {
        var amount = 0;
        for (const bet of this.bets.values())
            amount += bet.amount;
        return amount;
    }
}

matches = new Map();
const matchEvents = new EventEmitter();

function createMatch(key, player1, player2) {
    const match = new Match(player1, player2);
    matches.set(key, match);
    console.log('Created match ' + player1.name + ' vs. ' + player2.name);
    matchEvents.emit('match-created', key);
}

function createMatchFromNames(player1Name, player2Name) {
    const key = Math.random().toString(36).substr(2, 5);
    // Construct two players using the names, with no MongoDB id
    createMatch(key, constructGGPlayer('', player1Name), constructGGPlayer('', player2Name));
}

function addBet(key, mongoId, predictionNumber, amount) {
    // Ensure the bet is valid
    const matchToUpdate = matches.get(key);
    if (!matchToUpdate) return {success: false, notification: 'Invalid match'}; // Return if the match doesn't exist
    if (matchToUpdate.bets.has(mongoId)) return {success: false, notification: 'You already placed a bet on this match'}; // Return if the match is already bet on
    if(Date.now() - matchToUpdate.startTime > process.env.MAX_BET_TIME) {
        return {success: false, notification: 'No more time to bet on this match'}; // Return if there's no time left
    }

    // Create the bet and return it
    const newBet = new Bet(predictionNumber, amount);
    matchToUpdate.bets.set(mongoId, newBet);
    matchEvents.emit('match-updated', key);
    const matchString = 'Confirmed $' + amount + ' bet on ' + matchToUpdate.player1.name + ' vs. ' + matchToUpdate.player2.name;
    console.log('Added bet from ' + mongoId + ' with:' + amount);
    return {success: true, notification: matchString};
}

function addUserlessBet(key, predictionNumber, amount) {
    const matchToUpdate = matches.get(key);
    if (!matchToUpdate) return {success: false, notification: 'Invalid match'};

    const newBet = new Bet(predictionNumber, amount);
    matchToUpdate.bets.set('admin'+Math.random().toString(36).substr(2, 5), newBet); // Use a random ID for the userless bet
    matchEvents.emit('match-updated', key);
    const matchString = 'Confirmed $' + amount + ' bet on ' + matchToUpdate.player1.name + ' vs. ' + matchToUpdate.player2.name;
    return {success: true, notification: matchString};
}

function endMatch(key, winnerNumber) {
    // Get the variables of the ending match
    const matchToEnd = matches.get(key);
    if (!matchToEnd) return;
    const loserNumber = (1 - (winnerNumber - 1)) + 1;
    const total = matchToEnd.getTotalBets();
    const winnerTotal = matchToEnd.getBets(winnerNumber);
    const winnerName = matchToEnd.getPlayerName(winnerNumber);
    const loserName = matchToEnd.getPlayerName(loserNumber);
    
    // Calculate the payouts for betters
    for (const [mongoId, bet] of matchToEnd.bets.entries()) {
        if (bet.predictionNumber != winnerNumber)
            continue;
        
        const percentOfPot = bet.amount / winnerTotal;
        const earnings = Math.floor(total * percentOfPot);
        matchEvents.emit('bet-payout', mongoId, earnings, winnerName, loserName);
    }

    // Payout the winner and loser
    matchEvents.emit('winner-payout', matchToEnd.getPlayer(winnerNumber).mongoId, parseInt(process.env.WINNER_EARNINGS), loserName);
    matchEvents.emit('loser-payout', matchToEnd.getPlayer(loserNumber).mongoId, parseInt(process.env.LOSER_EARNINGS), winnerName);

    // Delete the match
    console.log('Ended match ' + winnerName + ' vs. ' + loserName);
    deleteMatch(key);
}

function deleteMatch(key) {
    matches.delete(key);
    matchEvents.emit('match-deleted', key);
}

function clearMatches() {
    matches.clear();
}

module.exports = { 
    constructGGPlayer: constructGGPlayer,
    Match: Match,
    matches: matches, 
    matchEvents: matchEvents,
    createMatch: createMatch,
    createMatchFromNames: createMatchFromNames,
    addBet: addBet,
    addUserlessBet: addUserlessBet,
    endMatch: endMatch,
    deleteMatch: deleteMatch,
    clearMatches
};