function socketManagement(io) {
    class Match {
        constructor(player1, player2, total1 = 0, total2 = 0) {
            this.player1 = player1;
            this.player2 = player2;
            this.total1 = total1;
            this.total2 = total2;
        }
    }
    var matches = new Map();

    // Creates a match object
    function createMatch(player1, player2) {
        var newMatch = new Match(player1, player2)
        var key = Math.random().toString(36).substr(2, 5);
        matches.set(key, newMatch);
        sendClientCreateMatch(key, newMatch);
    }

    // Updates a match object's totals
    function updateMatch(key, total1, total2) {
        var matchToUpdate = matches.get(key)
        if (matchToUpdate != null) {
            matchToUpdate.total1 = total1;
            matchToUpdate.total2 = total2;
        }
        sendClientUpdateMatch(key, total1, total2);
    }

    // Send all clients the newly created match
    function sendClientCreateMatch(key, matchToSend) {
        io.emit('match-created', { key, player1:matchToSend.player1, player2:matchToSend.player2 });
    }
    // Send all clients the newly updated match
    function sendClientUpdateMatch(key, total1, total2) {
        io.emit('match-updated', { key, total1:total1, total2:total2 });
    }

    // Send a given client all matches
    function sendClientAllMatches(socket) {
        // Create an array of keys and matches to send.
        // May need to change this later if match objects
        // dat differs bewteen client and server.
        var msg = [];
        for(const [key, matchToSend] of matches.entries()) {
            msg.push({key: key, match: matchToSend});
        }
        socket.emit('all-matches', msg);
    }

    io.on('connection', (socket) => {
        sendClientAllMatches(socket); // Send the client all matches upon connection

        // Create a new match when given admin command
        socket.on('admin-create-match', (msg) => {
            createMatch(msg.player1, msg.player2);
        });

        // Update a match when given admin command
        socket.on('admin-update-match', (msg) => {
            updateMatch(msg.key, msg.total1, msg.total2);
        });
    });
}

module.exports = socketManagement;