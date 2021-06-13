import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar.component'
import Better from './components/better.component'
import BetPopUp from './components/betPopUp.component';

function App() {
  return (
    <Router>
      <BetPopUp/>
      <Navbar/>
      <Better/>
    </Router>
  );
}

export default App;
