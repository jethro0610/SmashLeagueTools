import React from 'react';
import store from '../redux/store/store';
import { setDarkMode } from '../redux/reducers/darkMode';
import './css/darkModeToggle.css';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return { 
        darkMode: state.darkMode
    }
}

const ConnectDarkModeToggle = ({darkMode}) => {
    const handleToggle = (e) => {
        store.dispatch(setDarkMode(e.target.checked));
    }

    return (
        <div className="form-check form-switch dark-toggle-outer">
            <input className="form-check-input dark-toggle-inner" type="checkbox" id="flexSwitchCheckDefault" onChange={handleToggle}/>
        </div>
    );
}

const DarkModeToggle = connect(mapStateToProps)(ConnectDarkModeToggle);
export default DarkModeToggle;