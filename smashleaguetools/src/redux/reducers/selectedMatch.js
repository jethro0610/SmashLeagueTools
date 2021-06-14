import { Match, matches } from './matchList';

const initialState = {
    match: undefined
};

export const setSelectedMatch = key => {
    return { type: 'SET_SELECTED_MATCH', payload: {key}};
}

export const updateSelectedMatch = () => {
    return { type: 'UPDATE_SELECTED_MATCH'};
}

export const clearSelectedMatch = () => {
    return { type: 'CLEAR_SELECTED_MATCH'};
}

export const selectedMatchReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_SELECTED_MATCH':
            const setMatch = new Match();
            Object.assign(setMatch, matches.get(action.payload.key));
            return {
                match: setMatch
            }

        case 'UPDATE_SELECTED_MATCH':
            const updateMatch = new Match();
            Object.assign(updateMatch, matches.get(state.match.key));
            return {
                match: updateMatch
            }

        case 'CLEAR_SELECTED_MATCH':
            return {
                match: undefined
            }

        default:
            return state;
    }
};