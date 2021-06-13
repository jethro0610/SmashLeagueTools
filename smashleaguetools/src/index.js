import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux'; 
import store from './store/store';

//store.subscribe(() => console.log('Look ma, Redux!!'));
//store.dispatch(createMatch('asdf'));

ReactDOM.render(
  <Provider store = {store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);