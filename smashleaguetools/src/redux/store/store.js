import {combineReducers, createStore} from 'redux';
import {matchListReducer} from '../reducers/matchList';
import {selectedMatchReducer} from '../reducers/selectedMatch';
import { betPlayerNumberReducer, setBetPlayerNumber } from '../reducers/betPlayerNumber';
import { userInfoReducer } from '../reducers/userInfo'

const combined = combineReducers({
    matchList: matchListReducer, 
    selectedMatch: selectedMatchReducer,
    betPlayerNumber: betPlayerNumberReducer,
    userInfo: userInfoReducer});
    
const store = createStore(combined, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;

window.setBetPlayerNumber = (number) => {store.dispatch(setBetPlayerNumber(number))};