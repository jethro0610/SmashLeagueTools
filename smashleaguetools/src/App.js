import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar.component'
import Better from './components/better.component'
import BetPopUp from './components/betPopUp.component';

function App() {
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
