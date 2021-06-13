import { matches } from './matchList';

const initialState = {
    match: undefined
};

export const setSelectedMatch = (key) => {
    return { type: 'SET_MATCH', payload: {key}};
}

export const updateSelectedMatch = (key) => {
    return { type: 'UPDATE_MATCH', payload: {key}};
}

export const selectedMatchReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_MATCH':
            const selectedMatch = matches.get(action.payload.key);
            return {
                match: selectedMatch
            }

        default:
            return state;
    }
};