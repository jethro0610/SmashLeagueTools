import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './components/css/hide.css'
import './components/css/betbar.css'
import './components/css/betpopup.css'
import './components/css/better.css'
import './components/css/selector.css'
import './components/css/visualizer.css'

import Navbar from './components/navbar.component'
import Better from './components/better.component'
import BetPopUp from './components/betPopUp.component';

import axios from 'axios';
import store from './redux/store/store'
import { setUser } from './redux/reducers/userInfo';

const App = () => {
  useEffect(() => {
    axios.get('http://localhost:5000/users/get', {withCredentials: true})
      .then(res => {
        store.dispatch(setUser(res.data.name, res.data.balance, res.data.admin));
      })
      .catch(err => {
        console.log('Failed to login');
      });
  })

  return (
    <Router>
      <div className='d-flex flex-column vh-100'>
        <Navbar/>
        <BetPopUp/>
        <Better/>
      </div>
    </Router>
  );
}

export default App;
