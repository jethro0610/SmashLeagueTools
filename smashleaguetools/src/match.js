import io from 'socket.io-client'

class Match {
    constructor(player1, player2, total1 = 0, total2 = 0) {
        this.player1 = player1;
        this.player2 = player2;
        this.total1 = total1;
        this.total2 = total2;
    }
}
var allMatches = new Map();
const updateMatchEvent = new Event('updateMatches'); // Event to update better component once matches are updated

function deleteMatch(index) {
    allMatches.delete(index, 1);
    window.dispatchEvent(updateMatchEvent);
}

function printMatches() {
    console.log(allMatches);
}

// Create the connection to the Socket.IO server
const socket = io.connect('http://localhost:5000', {
    withCredentials: true
});

// Call the server to create a match from admin client
function adminCreateMatch(player1, player2) {
    socket.emit('admin-create-match', { player1: player1, player2: player2 });
}
// Call the server to update a match from admin client
function adminUpdateMatch(key, total1, total2) {
    socket.emit('admin-update-match', { key: key, total1: total1, total2: total2});
}

// Event when client recieves a match from the server
socket.on('all-matches', (msg) => {
    allMatches.clear(); // Remove all matches since a newly update map is sent
    for(const content of msg) {
        var newMatch = new Match(content.player1, content.player2, content.amount1, content.amount2);
        allMatches.set(content.key, newMatch);
    }
    window.dispatchEvent(updateMatchEvent);
});

// Event when client recieves a newly created match
socket.on('match-created', (msg) => {
    var key = msg.key;
    allMatches.set(key, new Match(msg.player1, msg.player2));
    window.dispatchEvent(updateMatchEvent);
});

// Expose functions to console
window.deleteMatch = deleteMatch;
window.printMatches = printMatches;
window.adminCreateMatch = adminCreateMatch;
window.adminUpdateMatch = adminUpdateMatch;

export default allMatches;