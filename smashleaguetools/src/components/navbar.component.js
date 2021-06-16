import React from 'react';
import { Link } from "react-router-dom";
import NavbarProfile from './navbarProfile.component';

const Navbar = () => {
    return (
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark shadow'>
            <div className='container-fluid'>

                <Link to='/' className='navbar-brand'>
                    Jippi League
                </Link>

                <div className='collapse navbar-collapse'>
                    <ul className='navbar-nav me-auto'>
                        <li className='nav-item'><div className="nav-link">Bracket</div></li>
                        <li className='nav-item'><div className="nav-link">Streaming</div></li>
                        <li className='nav-item'><div className="nav-link">Admin</div></li>
                    </ul>
                </div>

                <NavbarProfile/>
            </div>
        </nav>
    );
}

export default Navbar;