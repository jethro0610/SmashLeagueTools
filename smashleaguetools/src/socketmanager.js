import io from 'socket.io-client'
import store from './redux/store/store';
import { allMatches, createMatch, updateMatch} from './redux/reducers/matchList';
import { updateSelectedMatch, clearSelectedMatch } from './redux/reducers/selectedMatch';
import { setBalance } from './redux/reducers/userInfo';

// Create the connection to the Socket.IO server
export const socket = io.connect('http://localhost:5000', {
    withCredentials: true
});

socket.on('connect', () => {
    store.dispatch(clearSelectedMatch());
});

// Call the server to create a match from admin client
function adminCreateMatch(player1, player2) {
    socket.emit('admin-create-match', { player1: player1, player2: player2 });
}
// Call the server to update a match from admin client
function adminUpdateMatch(key, amount1, amount2) {
    socket.emit('admin-update-match', { key, amount1, amount2});
}

// Event when client recieves all matches
socket.on('all-matches', (msg) => {
    store.dispatch(allMatches(msg));
});

// Event when client recieves a newly created match
socket.on('match-created', (msg) => {
    store.dispatch(createMatch(msg.key, msg.player1, msg.player2));
});

// Event when client recieves a newly created match
socket.on('match-updated', (msg) => {
    store.dispatch(updateMatch(msg.key, msg.amount1, msg.amount2));
    if (store.getState().selectedMatch.match.key === msg.key)
        store.dispatch(updateSelectedMatch());
});

socket.on('balance-updated', (msg) => {
    console.log(msg);
    store.dispatch(setBalance(msg.balance));
})

// Expose functions to console
window.adminCreateMatch = adminCreateMatch;
window.adminUpdateMatch = adminUpdateMatch;
window.bet = (key, predictionNumber, amount) => {
    socket.emit('bet', {key, predictionNumber, amount});
}