import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import './components/css/globals.css'
import styled, { ThemeProvider } from 'styled-components';
import {mainBackgroundColor, textColor} from './themeStyles';

import Navbar from './components/navbar.component'
import Better from './components/better.component'
import BetPopUp from './components/betPopUp.component';
import ProfileUpdater from './components/profileUpdater.component';
import Notifier from './components/notifier.component'
import PreReg from './components/prereg.component';
import AdminConsole from './components/adminConsole.component';

import store from './redux/store/store'
import { connect } from 'react-redux';
import { refreshUser } from './redux/reducers/userInfo';
import { refreshTournament } from './redux/reducers/tournamentInfo';
import axios from 'axios';
store.dispatch(refreshUser);
store.dispatch(refreshTournament);

const AppContainer = styled.div`
  background-color: ${mainBackgroundColor};
  color: ${textColor};
`

const mapStateToProps = state => {
  return { 
      tournamentStarted: state.tournamentInfo.started,
      darkMode: state.darkMode
  };
};

const ConnectApp = ({tournamentStarted, darkMode}) => {
  // Returns betting if there's a tournament, and registration if there isn't
  var indexDiv;
  if(tournamentStarted === true) {
    indexDiv = <Route exact path='/'><BetPopUp/><Better/></Route>
  }
  else if(tournamentStarted === false) {
    indexDiv = <Route exact path='/'><PreReg/></Route>
  }

  // Set the theme
  var themeName = ''
  if(darkMode)
    themeName = 'dark'
  else
    themeName = 'light';

  return (
    <ThemeProvider theme={{ theme: themeName}}>
    <Router>
      <AppContainer className='d-flex flex-column vh-100'>
        <Navbar/>
        <Notifier/>
        {indexDiv}
        <Route path='/admin'><AdminConsole/></Route>
        <Route path='/profile'><ProfileUpdater/></Route> 
      </AppContainer>
    </Router>
    </ThemeProvider>
  );
}
const App = connect(mapStateToProps)(ConnectApp);

window.logTournament = () => {
  console.log(store.getState().tournamentInfo);
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
