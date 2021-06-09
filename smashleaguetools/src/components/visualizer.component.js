import React, {Component} from 'react';
import portrait from './../portrait.png'
import triangle from './../triangle.png'
import smashball from './../smashball.png'
import './visualizer.css'

export default class Visualizer extends Component {

    render() {
        var visibility;
        var player1;
        var player2;
        if (this.props.match == null) {
            visibility = ' hide';
            player1 = '';
            player2 = '';
        }
        else {
            visibility = '';
            player1 = this.props.match.player1;
            player2 = this.props.match.player2;
        }

        return(
            <div class='col overflow-visible text-center align-middle position-relative'>
                <div class={'row' + visibility}>
                    <div class='col border-bottom title'>Jippi Week 9</div>
                </div>

                <div class={'row' + visibility}>
                    <div class='col name'>{player1}</div>
                    <div class='col name'>{player2}</div>
                </div>

                <div class={'row' + visibility}>
                    <div class='col'><img src={triangle} class='triangle'/></div>
                    <div class='col'><img src={triangle} class='triangle'/></div>
                </div>

                <div class='row'>
                    <img src={smashball} class='smashball'/>
                    <div class='col'>
                        <img src={portrait} class={'col portrait' + visibility}/>
                    </div>
                    <div class='col flip'>
                        <img src={portrait} class={'col portrait' + visibility}/>
                    </div>
                </div>

                <div class={'row' + visibility}>
                    <div class='col amount'>
                        $1000
                    </div>
                </div>

                <div class={'row amounts shadow-sm border border-2 rounded-pill text-light progress' + visibility}>
                    <div class='progress-bar w-50 bg-light text-dark text-start'>
                        $700
                    </div>
                    <div class='progress-bar w-50 bg-dark text-end'>
                        $300
                    </div>
                </div>
            </div>
        )
    }
}