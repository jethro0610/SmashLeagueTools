import {combineReducers, createStore} from 'redux';
import {matchListReducer} from '../reducers/matchList';
import {selectedMatchReducer} from '../reducers/selectedMatch';
import { betPlayerNumberReducer, setBetPlayerNumber } from '../reducers/betPlayerNumber';

const combined = combineReducers({
    matchList: matchListReducer, 
    selectedMatch: selectedMatchReducer,
    betPlayerNumber: betPlayerNumberReducer});
const store = createStore(combined, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;

window.setBetPlayerNumber = (number) => {store.dispatch(setBetPlayerNumber(number))};