import React, {Component} from 'react';
import './css/betpopup.css'

export default class Navbar extends Component {
    render() {
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
                            <li className='nav-item'><a className="nav-link" href="http://localhost:5000/auth">Login</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}