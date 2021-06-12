import React, {Component} from 'react';

export default class Navbar extends Component {
    render() {
        return (
            <nav class='navbar navbar-expand-lg navbar-light bg-light shadow'>
                <div class='container-fluid'>
                    <div class='navbar-brand'>Jippi Shampionship League</div>
                    <div class='collapse navbar-collapse'>
                        <ul class='navbar-nav me-auto'>
                            <li class='nav-item'><div class="nav-link">Bracket</div></li>
                            <li class='nav-item'><div class="nav-link">Streaming</div></li>
                            <li class='nav-item'><div class="nav-link">Admin</div></li>
                        </ul>
                        <ul class='navbar-nav ms-auto'>
                            <li class='nav-item'><a class="nav-link" href="http://localhost:5000/auth">Login</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}