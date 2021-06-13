import { matches } from './matchList';
const initialState = {
    selectedMatch: undefined
}

export const setSelectedMatch = (key) => {
    return { type: 'SET_MATCH', payload: {key}};
}

export const updateSelectedMatchInfo = (key) => {
    return { type: 'UPDATE_MATCH', payload: {key}};
}

export const selectedMatchInfoReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_MATCH':
            const selectedMatch = matches.get(action.payload.key);
            return {
                selectedMatch: selectedMatch
            }

        default:
            return state;
    }
};