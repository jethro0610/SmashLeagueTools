const matches = require('./matches').matches;
const matchEvents = require('./matches').matchEvents;
const ggEvents = require('./smashgg').ggEvents;
const createMatchFromNames = require('./matches').createMatchFromNames;
const addBet = require('./matches').addBet;
const addUserlessBet = require('./matches').addUserlessBet;
const endMatch = require('./matches').endMatch;
const User = require('./models/user.model');

// Constructs player from socket data
const playerSocketInfo = (player) => {
    return {
        name: player.name,
        mongoId: player.mongoId
    }
}

class SocketManager {
    constructor(io, session) {
        this.io = io;
        this.mongoToSocketMap = new Map(); // Maps a Set of socket connections to a MongoDB user id

        this.io.on('connection', (socket) => {
            this.sendClientAllMatches(socket); // Send the client all matches upon connection
            if (socket.request.user) {
                // See if the map has the user and map the socket to the user
                const mongoUserSockets = this.mongoToSocketMap.get(socket.request.user.id);
                if (mongoUserSockets)
                mongoUserSockets.add(socket);
                else {
                    /// Create a new user in the map and add map the socket to the user
                    this.mongoToSocketMap.set(socket.request.user.id, new Set());
                    this.mongoToSocketMap.get(socket.request.user.id).add(socket);
                }
            }
                
            socket.on('disconnect', () => {
                if (socket.request.user) {
                    // See if the map has the user and remove the disconnecting socket connection
                    const mongoUserSockets = this.mongoToSocketMap.get(socket.request.user.id);
                    if (!mongoUserSockets) return;
                    if (mongoUserSockets) {
                        mongoUserSockets.delete(socket);
                    }
                    if(mongoUserSockets.size == 0) // Delete the user from the map if they have no connections
                        this.mongoToSocketMap.delete(socket.request.user.id)
                }
            })
            
            // Create a userless match from admin command
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


            // End a match on admin command
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

                // Ensure the bet is valid
                if (msg.predictionNumber != 1 && msg.predictionNumber != 2) return; // Return if the prediction number is invalid
                msg.amount = parseInt(msg.amount); // Ensure the amount given is a number
                if (msg.amount <= 0 || isNaN(msg.amount)) return; // Return if the amount is invalid
                if (socket.request.user.balance < msg.amount) { // Return if the user doesn't have enough money
                    socket.emit('notification', 'Your balance is less than $' + msg.amount);
                    return;
                }

                // Add the bet if everything is valid
                const {success, notification} = addBet(msg.key, socket.request.user.id, msg.predictionNumber, msg.amount);
                if(!success) {
                    socket.emit('notification', notification)
                    return false;
                }

                // Update the users balance and set them a bet confirmation
                const newBalance = socket.request.user.balance - msg.amount;
                this.setMongoIdBalance(socket.request.user.id, newBalance);
                socket.emit('bet-confirmed', {});
                socket.emit('notification', notification);
            });
        });

        // Inform sockets a match was created
        matchEvents.on('match-created', key => {
            // Get the newly created match
            const matchToEmit = matches.get(key);
            if (matchToEmit == null)
                return;
            
            // Emit the info to all sockets
            this.io.emit('match-created', {
                key,
                player1: playerSocketInfo(matchToEmit.player1),
                player2: playerSocketInfo(matchToEmit.player2),
                startTime: matchToEmit.startTime
            });
        })

        // Inform sockets a match was updated
        matchEvents.on('match-updated', key => {
            // Get the updated match
            const matchToEmit = matches.get(key);
            if (matchToEmit == null)
                return;

            // Emit the updated info to all sockets
            this.io.emit('match-updated', {
                key: key, 
                amount1: matchToEmit.getBets(1), 
                amount2: matchToEmit.getBets(2)});
        })

        // Inform sockets a match was deleted
        matchEvents.on('match-deleted', key => {
            this.io.emit('match-deleted', {
                key: key
            });
        })

        // Send a betting socket their bet payout
        matchEvents.on('bet-payout', (mongoId, amount, winnerName, loserName) => {
            // Don't send the payout if the bet is userless
            if(mongoId.substring(0,5) === 'admin')
                return;
            
            // Find the user to payout and update their balance
            User.findById(mongoId).then(user => {
                const newBalance = user.balance + amount;
                this.setMongoIdBalance(mongoId, newBalance);
                this.sendMongoIdNotification(mongoId, 'You won $' + amount + ' for ' + winnerName + '\'s win over ' + loserName);
            })
            .catch(err => {
                console.log(err);
            })
        })

        // Send a winning socket their match payout
        matchEvents.on('winner-payout', (mongoId, amount, loserName) => {
            if(!mongoId)
                return;
            
            // Find the user to payout and update their balance
            User.findById(mongoId).then(user => {
                const newBalance = user.balance + amount;
                this.setMongoIdBalance(mongoId, newBalance);
                this.sendMongoIdNotification(mongoId, 'You won $' + amount + ' for beating ' + loserName);
            })
            .catch(err => {
                console.log(err);
            })
        })

        // Send a losing socket their payout
        matchEvents.on('loser-payout', (mongoId, amount, winnerName) => {
            if(!mongoId)
                return;

            // Find the user to payout and update their balance
            User.findById(mongoId).then(user => {
                const newBalance = user.balance + amount;
                this.setMongoIdBalance(mongoId, newBalance);
                this.sendMongoIdNotification(mongoId, 'You earned $' + amount + ' for trying against ' + winnerName);
            })
            .catch(err => {
                console.log(err);
            })
        })

        // Inform all sockets the tournament started
        ggEvents.on('tournament-started', () => {
            this.io.emit('tournament-started');
        })

        // Inform all sockets the tournament ended
        ggEvents.on('tournament-ended', () => {
            this.io.emit('tournament-ended');
        })
    }

    // Get all sockets associated with the MongoDB id
    getSocketsFromMongoId(mongoId) {
        return this.mongoToSocketMap.get(mongoId);
    }

    // Set the balance of a given user from their MongoDB id
    setMongoIdBalance(mongoId, balance) {
        // Find the user and set their balance
        User.findByIdAndUpdate(mongoId, {balance}, {new: true}, (err, user) => {});

        // Get the sockets of that user
        const socketsToPay = this.getSocketsFromMongoId(mongoId);
        if (!socketsToPay) return;

        // Update the balance of the sockets and send the balance updates to them
        for(const socketToPay of socketsToPay) {
            socketToPay.request.user.balance = balance;
            socketToPay.emit('balance-updated', { balance: socketToPay.request.user.balance});
        }
    }

    // Send a notification to all socket connections of a given MongoDB id
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