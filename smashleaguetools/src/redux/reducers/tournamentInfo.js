
import axios from 'axios';
import store from '../store/store'

const initialState = {
    started: undefined
};

export const refreshTournament = async (dispatch, getState) => {
    try {
        const res = await axios.get(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/getinfo', {withCredentials: true});
        console.log(res);
        store.dispatch(setTournament(res.data.preregTitle, res.data.preregDate, res.data.id, res.data.title, res.data.started));
    }
    catch (err) {
        console.log('Failed to login/refresh tournament');
    }
}

const setTournament = (preregTitle, preregDate, id, title, started) => {
    return { type: 'SET_TOURNAMENT', payload: {preregTitle, preregDate, id, title, started}};
}

export const tournamentInfoReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_TOURNAMENT':
            return {
                preregTitle: action.payload.preregTitle,
                preregDate: action.payload.preregDate,
                id: action.payload.id,
                title: action.payload.title,
                started: action.payload.started,
            }

        default:
            return state;
    }
};