
import axios from 'axios';
import store from '../store/store'

const initialState = {
    started: undefined
};

export const refreshTournament = async (dispatch, getState) => {
    try {
        const res = await axios.get(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/getinfo', {withCredentials: true});
        store.dispatch(setTournament(res.data));
    }
    catch (err) {
        console.log('Failed to login/refresh tournament');
    }
}

const setTournament = (tournamentInfo) => {
    return { type: 'SET_TOURNAMENT', payload: tournamentInfo};
}

export const tournamentInfoReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_TOURNAMENT':
            return action.payload;

        default:
            return state;
    }
};