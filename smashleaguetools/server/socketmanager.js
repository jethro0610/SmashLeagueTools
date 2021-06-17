const matches = require('./matches').matches;
const matchEvents = require('./matches').matchEvents;
const createMatchFromNames = require('./matches').createMatchFromNames;
const addBet = require('./matches').addBet;
const addUserlessBet = require('./matches').addUserlessBet;
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

const playerSocketInfo = (player) => {
    return {
        name: player.name,
        mongoId: player.mongoId
    }
}

class SocketManager {
    constructor(io, session) {
        this.io = io;
        this.mongoToSocketMap = new Map();

        this.io.on('connection', (socket) => {
            this.sendClientAllMatches(socket); // Send the client all matches upon connection
            if (socket.request.user) {
                const mongoToSocketSet = this.mongoToSocketMap.get(socket.request.user.id);
                if (mongoToSocketSet)
                    mongoToSocketSet.add(socket);
                else {
                    this.mongoToSocketMap.set(socket.request.user.id, new Set());
                    this.mongoToSocketMap.get(socket.request.user.id).add(socket);
                }
            }
                
            socket.on('disconnect', () => {
                if (socket.request.user) {
                    const mongoToSocketSet = this.mongoToSocketMap.get(socket.request.user.id);
                    if (!mongoToSocketSet) return;
                    if (mongoToSocketSet) {
                        mongoToSocketSet.delete(socket);
                    }
                    if(mongoToSocketSet.size == 0)
                        this.mongoToSocketMap.delete(socket.request.user.id)
                }
            })
            
            socket.on('admin-bet', (msg) => {
                if (!socket.request.user) return;
                if (!socket.request.user.admin) return;
                
                addUserlessBet(msg.key, msg.predictionNumber, msg.amount);
            });

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
                if (!socket.request.user) {
                    socket.emit('notification', 'You must be logged in to bet')
                    return ;
                }
                if (msg.predictionNumber != 1 && msg.predictionNumber != 2) return;
                msg.amount = parseInt(msg.amount);
                if (msg.amount <= 0 || isNaN(msg.amount)) return;
                if (socket.request.user.balance < msg.amount) {
                    socket.emit('notification', 'Your balance is less than $' + msg.amount);
                    return;
                }
                const {success, notification} = addBet(msg.key, socket.request.user.id, msg.predictionNumber, msg.amount);
                if(!success) {
                    socket.emit('notification', notification)
                    return false;
                }

                const newBalance = socket.request.user.balance - msg.amount;
                this.setMongoIdBalance(socket.request.user.id, newBalance);
                socket.emit('bet-confirmed', {});
                socket.emit('notification', notification);
            });
        });

        matchEvents.on('match-created', key => {
            const matchToEmit = matches.get(key);
            if (matchToEmit == null)
                return;
                
            this.io.emit('match-created', {
                key,
                player1: playerSocketInfo(matchToEmit.player1),
                player2: playerSocketInfo(matchToEmit.player2),
                startTime: matchToEmit.startTime
            });
        })

        matchEvents.on('match-updated', key => {
            const matchToEmit = matches.get(key);
            if (matchToEmit == null)
                return;

            this.io.emit('match-updated', {
                key: key, 
                amount1: matchToEmit.getBets(1), 
                amount2: matchToEmit.getBets(2)});
        })

        matchEvents.on('match-deleted', key => {
            this.io.emit('match-deleted', {
                key: key
            });
        })

        matchEvents.on('bet-payout', (mongoId, amount, winnerName, loserName) => {
            if(mongoId.substring(0,5) === 'admin')
                return;
            User.findById(mongoId).then(user => {
                const newBalance = user.balance + amount;
                this.setMongoIdBalance(mongoId, newBalance);
                this.sendMongoIdNotification(mongoId, 'You won $' + amount + ' for ' + winnerName + '\'s win over ' + loserName);
            })
            .catch(err => {
                console.log(err);
            })
        })

        matchEvents.on('winner-payout', (mongoId, amount, loserName) => {
            if(!mongoId)
                return;
            console.log(mongoId);
            User.findById(mongoId).then(user => {
                const newBalance = user.balance + amount;
                this.setMongoIdBalance(mongoId, newBalance);
                this.sendMongoIdNotification(mongoId, 'You won $' + amount + ' for beating ' + loserName);
            })
            .catch(err => {
                console.log(err);
            })
        })

        matchEvents.on('loser-payout', (mongoId, amount, winnerName) => {
            if(!mongoId)
                return;
            User.findById(mongoId).then(user => {
                const newBalance = user.balance + amount;
                this.setMongoIdBalance(mongoId, newBalance);
                this.sendMongoIdNotification(mongoId, 'You earned $' + amount + ' for trying against ' + winnerName);
            })
            .catch(err => {
                console.log(err);
            })
        })
    }

    getSocketsFromMongoId(mongoId) {
        return this.mongoToSocketMap.get(mongoId);
    }

    setMongoIdBalance(mongoId, balance) {
        User.findByIdAndUpdate(mongoId, {balance}, {new: true}, (err, user) => {});
        const socketsToPay = this.getSocketsFromMongoId(mongoId);
        if (!socketsToPay) return;

        for(const socketToPay of socketsToPay) {
            socketToPay.request.user.balance = balance;
            socketToPay.emit('balance-updated', { balance: socketToPay.request.user.balance});
        }
    }

    sendMongoIdNotification(mongoId, notification) {
        const sockets = this.getSocketsFromMongoId(mongoId);
        if (!sockets) return;

        for(const socket of sockets) {
            socket.emit('notification', notification);
        }
    }

    // Send a given client all matches
    sendClientAllMatches(socket) {
        // Create an array of keys and matches to send.
        // May need to change this later if match objects
        // data differs bewteen client and server.
        var msg = [];
        for(const [key, matchToSend] of matches.entries()) {
            msg.push({key: key, 
                player1: playerSocketInfo(matchToSend.player1),
                amount1: matchToSend.getBets(1),
                player2: playerSocketInfo(matchToSend.player2),
                amount2: matchToSend.getBets(2),
                startTime: matchToSend.startTime}
            )
        }
        socket.emit('all-matches', msg);
    }
}

module.exports = SocketManager;