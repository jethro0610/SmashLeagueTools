class Match {
    constructor(player1, player2){
        this.player1 = player1;
        this.player2 = player2;
        this.total1 = 0;
        this.total2 = 0;
    }
}

var allMatches = [];
const updateMatchEvent = new Event('updateMatches');

function addMatch(player1, player2) {
    allMatches.push(new Match(player1, player2));
    window.dispatchEvent(updateMatchEvent);
}

function updateMatch(index, total1, total2) {
    allMatches[index].total1 = total1;
    allMatches[index].total2 = total2;
    window.dispatchEvent(updateMatchEvent);
}

function deleteMatch(index) {
    allMatches.splice(index, 1);
    window.dispatchEvent(updateMatchEvent);
}

export default allMatches;
window.addMatch = addMatch;
window.updateMatch = updateMatch;
window.deleteMatch = deleteMatch;