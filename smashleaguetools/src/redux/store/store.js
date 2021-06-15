import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {matchListReducer} from '../reducers/matchList';
import {selectedMatchReducer} from '../reducers/selectedMatch';
import { betInfoReducer } from '../reducers/betInfo';
import { userInfoReducer } from '../reducers/userInfo'

const combined = combineReducers({
    matchList: matchListReducer, 
    selectedMatch: selectedMatchReducer,
    betInfo: betInfoReducer,
    userInfo: userInfoReducer});
    
const store = createStore(combined, applyMiddleware(thunk));
export default store;