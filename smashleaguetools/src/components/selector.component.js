import React, {Component} from 'react';
import'./selector.css'
import circle from './../circle.png'

export default class Selector extends Component {
    render() {
        var player1 = '';
        var player2 = '';
        if (this.props.match != null) {
            player1 = this.props.match.player1;
            player2 = this.props.match.player2;
        }
        var buttonClick = this.props.buttonClick;
        
        return(
            <button class='row px-0 mx-0 bg-light shadow-sm selector rounded-pill border overflow-hidden w-100' onClick={buttonClick}>
                <img src={circle} class='circle'/> 
                <div class ='col px-0 align-middle text-start border-bottom border-5 rounded'>{player1} vs. {player2}</div>
            </button>
        )
    }
}