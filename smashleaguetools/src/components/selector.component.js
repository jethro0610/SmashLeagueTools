import React, {Component} from 'react';
import'./selector.css'
import circle from './../circle.png'

export default class Selector extends Component {
    render() {
        return(
            <button class='row px-0 mx-0 bg-light shadow-sm selector rounded-pill border overflow-hidden w-100' onClick={this.props.buttonClick}>
                <img src={circle} class='circle'/> 
                <div class ='col px-0 align-middle text-start border-bottom border-5 rounded'>{this.props.player1Name} vs. {this.props.player2Name}</div>
            </button>
        )
    }
}