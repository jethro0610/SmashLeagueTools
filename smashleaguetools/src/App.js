import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import './components/css/hide.css'
import './components/css/betbar.css'
import './components/css/betpopup.css'
import './components/css/better.css'
import './components/css/selector.css'
import './components/css/visualizer.css'
import './components/css/profileUpdater.css'

import Navbar from './components/navbar.component'
import Better from './components/better.component'
import BetPopUp from './components/betPopUp.component';
import ProfileUpdater from './components/profileUpdater.component';

import store from './redux/store/store'
import { refreshUser } from './redux/reducers/userInfo';

const App = () => {
  useEffect(() => {
    store.dispatch(refreshUser);
  })

  return (
    <Router>
      <div className='d-flex flex-column vh-100'>
        <Navbar/>

        <Route exact path='/'>
          <BetPopUp/>
          <Better/>
        </Route>

        <Route path='/profile'>
          <ProfileUpdater/>
        </Route> 
      </div>
    </Router>
  );
}

export default App;
