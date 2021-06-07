import React, {Component} from 'react';
import'./selector.css'
import circle from './../circle.png'

export default class Selector extends Component {
    render() {
        return(
            <div class='row bg-light shadow selector rounded-pill border overflow-hidden'>
                    <img src={circle} class='circle'/> 
                    <div class ='col px-0 align-top text-start border-bottom border-5 rounded'>Liar vs. Pizza Steve</div>
            </div>
        )
    }
}