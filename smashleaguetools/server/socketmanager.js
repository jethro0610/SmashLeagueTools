const matches = require('./matches').matches;
const matchEvents = require('./matches').matchEvents;
const createMatchFromNames = require('./matches').createMatchFromNames;
const User = require('./models/user.model');

const getUser = async (socket, next) => {
    var userId;
    try {
        userId = socket.request.session.passport.user;
    }
    catch {
        return next();
    }

    const user = await User.findById(userId, (err, user) => {
        if(err) console.log(err);
    }).exec();

    if (user)
        socket.user = user;

    return next();
}

class SocketManager {
    constructor(io, session) {
        this.io = io;
        
        io.use((socket, next) => {
            session(socket.request, {}, next);
        });
        io.use((socket, next) => {
            getUser(socket, next);
        });

        this.io.on('connection', async (socket) => {
            this.sendClientAllMatches(socket); // Send the client all matches upon connection
    
            // Create a new match when given admin command
            socket.on('admin-create-match', (msg) => {
                if (!socket.user)
                    return;
                if(!socket.user.admin)
                    return;
                
                createMatchFromNames(msg.player1, msg.player2);
            });
        });

        matchEvents.on('match-created', (key, match) => {
            this.emitMatchCreated(key);
        })
    }

    // Send a given client all matches
    sendClientAllMatches(socket) {
        // Create an array of keys and matches to send.
        // May need to change this later if match objects
        // data differs bewteen client and server.
        var msg = [];
        for(const [key, matchToSend] of matches.entries()) {
            msg.push({key: key, 
                player1: matchToSend.player1.name, 
                amount1: matchToSend.getBets(1),
                player2: matchToSend.player2.name,
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
}

module.exports = SocketManager;