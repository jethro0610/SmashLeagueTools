import io from 'socket.io-client'
import store from './redux/store/store';
import {createMatch, allMatches} from './redux/reducers/matchList';

// Create the connection to the Socket.IO server
export const socket = io.connect('http://localhost:5000', {
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

// Event when client recieves a newly created match
socket.on('match-created', (msg) => {
    store.dispatch(createMatch(msg.key, msg.player1, msg.player2));
});

// Event when client recieves all matches
socket.on('all-matches', (msg) => {
    store.dispatch(allMatches(msg));
});

// Expose functions to console
window.adminCreateMatch = adminCreateMatch;
window.adminUpdateMatch = adminUpdateMatch;