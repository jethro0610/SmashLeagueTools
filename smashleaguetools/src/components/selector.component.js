import React, {Component} from 'react';
import'./selector.css'
import circle from './../circle.png'

export default class Selector extends Component {
    render() {
        var name1 = this.props.name1;
        var name2 = this.props.name2;
        return(
            <div class='row bg-light shadow-sm selector rounded-pill border overflow-hidden'>
                <img src={circle} class='circle'/> 
                <div class ='col px-0 align-middle text-start border-bottom border-5 rounded'>{name1} vs. {name2}</div>
            </div>
        )
    }
}