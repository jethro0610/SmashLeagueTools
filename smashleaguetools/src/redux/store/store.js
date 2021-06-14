import {combineReducers, createStore} from 'redux';
import {matchListReducer} from '../reducers/matchList';
import {selectedMatchReducer} from '../reducers/selectedMatch';
import { betInfoReducer } from '../reducers/betInfo';
import { userInfoReducer } from '../reducers/userInfo'

const combined = combineReducers({
    matchList: matchListReducer, 
    selectedMatch: selectedMatchReducer,
    betInfo: betInfoReducer,
    userInfo: userInfoReducer});
    
const store = createStore(combined, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;