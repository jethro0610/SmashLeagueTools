const matches = require('./matches').matches;
const matchEvents = require('./matches').matchEvents;
const createMatchFromNames = require('./matches').createMatchFromNames;
const addBet = require('./matches').addBet;
const endMatch = require('./matches').endMatch;
const User = require('./models/user.model');

const updateSocketUser = async (socket) => {
    if(!socket.request.user)
        return;
        
    const user = await User.findById(socket.request.user.id, (err, user) => {
        if(err) console.log(err);
    }).exec();

    if (!user)
        return;

    socket.request.user = user;
}

class SocketManager {
    constructor(io, session) {
        this.io = io;
        this.mongoToSocketMap = new Map();

        this.io.on('connection', (socket) => {
            this.sendClientAllMatches(socket); // Send the client all matches upon connection
            if (socket.request.user)
                this.mongoToSocketMap.set(socket.request.user.id, socket);
                
            // Create a new match when given admin command
            socket.on('admin-create-match', (msg) => {
                if (!socket.request.user) return;
                if (!socket.request.user.admin) return;
                
                createMatchFromNames(msg.player1, msg.player2);
            });

            socket.on('admin-end-match', (msg) => {
                if (!socket.request.user) return;
                if (!socket.request.user.admin) return;

                endMatch(msg.key, msg.winnerNumber);
            })

            socket.on('bet', (msg) => {
                if (!socket.request.user) return;
                if (msg.predictionNumber != 1 && msg.predictionNumber != 2) return;
                msg.amount = parseInt(msg.amount);
                if (msg.amount <= 0 || isNaN(msg.amount)) return;
                if (socket.request.user.balance < msg.amount) return;

                if(!addBet(msg.key, socket.request.user.id, msg.predictionNumber, msg.amount))
                    return;

                const newBalance = socket.request.user.balance - msg.amount;
                this.setSocketBalance(socket, newBalance);
                socket.emit('bet-confirmed', {});
            });
        });

        matchEvents.on('match-created', key => {
            this.emitMatchCreated(key);
        })

        matchEvents.on('match-updated', key => {
            this.emitMatchUpdated(key);
        })

        matchEvents.on('payout', (mongoId, amount) => {
            const socketToPay = this.getSocketFromMongoId(mongoId);
            if (!socketToPay) return;
            if (!socketToPay.request.user) return;

            const newBalance = socketToPay.request.user.balance + amount;
            this.setSocketBalance(socketToPay, newBalance);
        })
    }

    getSocketFromMongoId(mongoId) {
        return this.mongoToSocketMap.get(mongoId);
    }

    setSocketBalance(socket, balance) {
        socket.request.user.balance = balance;
        User.findByIdAndUpdate(socket.request.user.id, {balance: socket.request.user.balance}, {new: true}, (err, user) => {});
        socket.emit('balance-updated', { balance: socket.request.user.balance});
    }

    // Send a given client all matches
    sendClientAllMatches(socket) {
        // Create an array of keys and matches to send.
        // May need to change this later if match objects
        // data differs bewteen client and server.
        var msg = [];
        for(const [key, matchToSend] of matches.entries()) {
            msg.push({key: key, 
                player1Name: matchToSend.player1.name, 
                amount1: matchToSend.getBets(1),
                player2Name: matchToSend.player2.name,
                amount2: matchToSend.getBets(2)});
        }
        socket.emit('all-matches', msg);
    }

    emitMatchCreated(matchKey) {
        var matchToEmit = matches.get(matchKey);
        if (matchToEmit == null)
            return;

        this.io.emit('match-created', {key: matchKey, 
            player1: matchToEmit.player1.name, 
            player2: matchToEmit.player2.name});
    }

    emitMatchUpdated(matchKey) {
        var matchToEmit = matches.get(matchKey);
        if (matchToEmit == null)
            return;

        this.io.emit('match-updated', {key: matchKey, 
            amount1: matchToEmit.getBets(1), 
            amount2: matchToEmit.getBets(2)});
    }
}

module.exports = SocketManager;