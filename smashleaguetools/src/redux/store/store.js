import {combineReducers, createStore} from 'redux';
import {matchListReducer} from '../reducers/matchList';
import {selectedMatchReducer} from '../reducers/selectedMatchInfo';

const combined = combineReducers({matchList: matchListReducer, selectedMatch: selectedMatchReducer});
const store = createStore(combined, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;