import React from 'react';
import { Link } from "react-router-dom";
import NavbarProfile from './navbarProfile.component';
import './css/navbar.css'

const Navbar = () => {
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
                    </ul>
                </div>

                <NavbarProfile/>
            </div>
        </nav>
    );
}

export default Navbar;