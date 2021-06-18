import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import './components/css/globals.css'
import Navbar from './components/navbar.component'
import Better from './components/better.component'
import BetPopUp from './components/betPopUp.component';
import ProfileUpdater from './components/profileUpdater.component';
import Notifier from './components/notifier.component'
import PreReg from './components/prereg.component';

import store from './redux/store/store'
import { refreshUser } from './redux/reducers/userInfo';
import axios from 'axios';
const App = () => {
  useEffect(() => {
    store.dispatch(refreshUser);
  })

  return (
    <Router>
      <div className='d-flex flex-column vh-100'>
        <Navbar/>
        <Notifier/>
        <PreReg/>
        {/*
        <Route exact path='/'>
          <BetPopUp/>
          <Better/>
        </Route>
        */}
        <Route path='/profile'>
          <ProfileUpdater/>
        </Route> 
      </div>
    </Router>
  );
}



window.adminSetTournament = (tournamentId) => {
  axios.post(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/set', {tournamentId}, {withCredentials : true})
  .then(res => {
      console.log(res);
  })
  .catch(err => {
      console.log(err);
  })
}

export default App;
