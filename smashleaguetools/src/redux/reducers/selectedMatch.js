import { Match, matches } from './matchList';

const initialState = {
    match: undefined
};

export const setSelectedMatch = (key) => {
    return { type: 'SET_MATCH', payload: {key}};
}

export const updateSelectedMatch = (key) => {
    return { type: 'UPDATE_SELECTED_MATCH'};
}

export const selectedMatchReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_MATCH':
            const setMatch = new Match();
            Object.assign(setMatch, matches.get(action.payload.key));
            return {
                match: setMatch
            }
            
        case 'UPDATE_SELECTED_MATCH':
            console.log('Updating selected');
            console.log(state.match);
            const updateMatch = new Match();
            Object.assign(updateMatch, matches.get(state.match.key));
            console.log(updateMatch);
            return {
                match: updateMatch
            }

        default:
            return state;
    }
};