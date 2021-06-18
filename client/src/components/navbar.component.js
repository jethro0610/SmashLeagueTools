import React from 'react';
import { Link } from "react-router-dom";
import NavbarProfile from './navbarProfile.component';
import './css/navbar.css'

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { 
        admin: state.userInfo.admin
    }
}

const ConnectNavbar = ({admin}) => {
    const adminSelector = 
    <li className='nav-item'>
        <Link to='/admin' className="nav-link">Admin</Link>
    </li>
    return (
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark shadow'>
            <div className='container-fluid'>

                <Link to='/' className='navbar-brand'>
                    Jippi League
                </Link>

                <div className='collapse navbar-collapse'>
                    <ul className='navbar-nav me-auto'>
                        <li className='nav-item'>
                            <a rel='noopener noreferrer' target='_blank' href={process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/bracket'} className="nav-link">Bracket</a>
                        </li>
                        {adminSelector}
                    </ul>
                </div>

                <NavbarProfile/>
            </div>
        </nav>
    );
}

const Navbar = connect(mapStateToProps)(ConnectNavbar);
export default Navbar;