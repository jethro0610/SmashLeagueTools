import React, {Component} from 'react';
import'./selector.css'
import store from '../redux/store/store';
import {setSelectedMatch} from '../redux/reducers/selectedMatch';
import circle from './../circle.png'

export default class Selector extends Component {
    dispatchSelectedMatch = () =>{
        store.dispatch(setSelectedMatch(this.props.matchKey));
    }

    render() {
        return(
            <button className='row px-0 mx-0 bg-light shadow-sm selector rounded-pill border overflow-hidden w-100' onClick={this.dispatchSelectedMatch}>
                <img src={circle} className='circle' alt=''/> 
                <div className ='col px-0 align-middle text-start border-bottom border-5 rounded'>{this.props.player1Name} vs. {this.props.player2Name}</div>
            </button>
        )
    }
}