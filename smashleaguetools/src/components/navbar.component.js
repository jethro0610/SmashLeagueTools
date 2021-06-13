import React from 'react';
import './css/betpopup.css'

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { 
        name: state.userInfo.name,
        balance: state.userInfo.balance
    };
};

const ConnectedNavbar = ({name, balance}) => {
    var endElement;
    if (name === undefined)
        endElement = <li className='nav-item'><a className="nav-link" href="http://localhost:5000/auth">Login</a></li>;
    else
        endElement = <li className='nav-item'><div className="nav-link">${balance}</div></li>;

    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light shadow'>
            <div className='container-fluid'>
                <div className='navbar-brand'>Jippi Shampionship League</div>
                <div className='collapse navbar-collapse'>
                    <ul className='navbar-nav me-auto'>
                        <li className='nav-item'><div className="nav-link">Bracket</div></li>
                        <li className='nav-item'><div className="nav-link">Streaming</div></li>
                        <li className='nav-item'><div className="nav-link">Admin</div></li>
                    </ul>
                    <ul className='navbar-nav ms-auto'>
                        {endElement}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

const Navbar = connect(mapStateToProps)(ConnectedNavbar);
export default Navbar;