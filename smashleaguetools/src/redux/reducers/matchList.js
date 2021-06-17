export class Match {
    constructor(key, player1, player2, startTime, amount1 = 0, amount2 = 0) {
        this.key = key;
        this.player1 = player1;
        this.player2 = player2;
        this.startTime = startTime;
        this.amount1 = amount1;
        this.amount2 = amount2;
    }
}

export var matches = new Map();

const initialState = {
    list: []
}

export const allMatches = (allMatches) => {
    return { type: 'ALL_MATCH', payload: {allMatches} };
}

export const createMatch = (key, player1, player2, startTime) => {
    return { type: 'CREATE_MATCH', payload: {key, player1, player2, startTime} };
}

export const deleteMatch = (key) => {
    return { type: 'DELETE_MATCH', payload: {key} };
}

export const updateMatch = (key, amount1, amount2) => {
    return { type: 'UPDATE_MATCH', payload: {key, amount1, amount2} };
}

export const matchListReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'ALL_MATCH':
            const allArray = action.payload.allMatches;

            matches = new Map();
            for (const curMatch of allArray) {
                matches.set(curMatch.key, new Match(
                    curMatch.key,
                    curMatch.player1,
                    curMatch.player2,
                    curMatch.startTime,
                    curMatch.amount1,
                    curMatch.amount2));
            }

            return {
                list: allArray
            }

        case 'CREATE_MATCH':
            const newMatch = new Match(action.payload.key, action.payload.player1, action.payload.player2, action.payload.startTime);
            matches.set(action.payload.key, newMatch);
            const createdArray = Array.from(matches.values());
            return {
                list: createdArray
            }
        
        case 'DELETE_MATCH':
            matches.delete(action.payload.key);
            const deletedArray = Array.from(matches.values());

            return {
                list: deletedArray
            }

        case 'UPDATE_MATCH':
            const matchToUpdate = matches.get(action.payload.key);
            if (!matchToUpdate)
                return state;

            matchToUpdate.amount1 = action.payload.amount1;
            matchToUpdate.amount2 = action.payload.amount2;
            const updatedArray = Array.from(matches.values());

            return {
                list: updatedArray
            }

        default:
            return state;
    }
};