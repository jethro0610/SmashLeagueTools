import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'; 
import store from './redux/store/store';
import './socketmanager'
require('dotenv').config({path:'../.env.' + process.env.NODE_ENV});
console.log(process.env);
ReactDOM.render(
  <Provider store = {store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);