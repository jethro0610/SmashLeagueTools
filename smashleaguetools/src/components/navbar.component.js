import React, {Component} from 'react';
import { Link } from 'react-router-dom'

export default class Navbar extends Component {
    render() {
        return (
            <nav class='navbar navbar-expand-lg navbar-light bg-light shadow'>
                <div class='container-fluid'>
                    <Link to='/' class='navbar-brand'>Jippi Shampionship League</Link>
                    <div class='collapse navbar-collapse'>
                        <ul class='navbar-nav me-auto'>
                            <li class='nav-item'><a class="nav-link" href="#">Bracket</a></li>
                            <li class='nav-item'><a class="nav-link" href="#">Leaderboards</a></li>
                            <li class='nav-item'><a class="nav-link" href="#">Streaming</a></li>
                            <li class='nav-item'><a class="nav-link" href="#">Admin</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}