import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {matchListReducer} from '../reducers/matchList';
import {selectedMatchReducer} from '../reducers/selectedMatch';
import { betInfoReducer } from '../reducers/betInfo';
import { userInfoReducer } from '../reducers/userInfo'
import { notificationReducer } from '../reducers/notifications';
import { tournamentInfoReducer } from '../reducers/tournamentInfo';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const combined = combineReducers({
    matchList: matchListReducer, 
    selectedMatch: selectedMatchReducer,
    betInfo: betInfoReducer,
    userInfo: userInfoReducer,
    notifications: notificationReducer,
    tournamentInfo: tournamentInfoReducer});
    
const store = createStore(combined, composeEnhancers(applyMiddleware(thunk)));
export default store;