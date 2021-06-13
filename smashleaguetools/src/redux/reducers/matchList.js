export class Match {
    constructor(key, player1Name, player2Name, amount1 = 0, amount2 = 0) {
        this.key = key;
        this.player1Name = player1Name;
        this.player2Name = player2Name;
        this.amount1 = amount1;
        this.amount2 = amount2;
    }
}

export var matches = new Map();

const initialState = {
    matchList: []
}

export const createMatch = (key, player1Name, player2Name) => {
    return { type: 'CREATE_MATCH', payload: {key, player1Name, player2Name} };
}

export const allMatches = (allMatches) => {
    return { type: 'ALL_MATCH', payload: {allMatches} };
}

export const matchListReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'CREATE_MATCH':
            const newMatch = new Match(action.payload.key, action.payload.player1Name, action.payload.player2Name);
            matches.set(action.payload.key, newMatch);
            const matchesArray = Array.from(matches.values());

            return {
                matchList: matchesArray
            }
            
        case 'ALL_MATCH':
            const matchArray = action.payload.allMatches;
            matches = new Map();
            for (const curMatch of matchArray) {
                matches.set(curMatch.key, new Match(
                    curMatch.key,
                    curMatch.player1Name,
                    curMatch.player2Name,
                    curMatch.amount1,
                    curMatch.amount2));
            }

            return {
                matchList: matchArray
            }

        default:
            return state;
    }
};