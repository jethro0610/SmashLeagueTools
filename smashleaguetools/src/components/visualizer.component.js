import React, {Component} from 'react';
import portrait from './../portrait.png'
import triangle from './../triangle.png'
import smashball from './../smashball.png'
import './visualizer.css'
import BetBar from './betbar.component.js'

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { selectedMatch: state.selectedMatch.match };
};

const ConnectedVisualizer = ({selectedMatch}) => {
    var visibility = ' hide';
    var player1Name = '.';
    var player2Name = '.';
    var amount1 = 50;
    var amount2 = 50;
    if (selectedMatch != null) {
        visibility = '';
        player1Name = selectedMatch.player1Name;
        player2Name = selectedMatch.player2Name;
        amount1 = selectedMatch.amount1;
        amount2 = selectedMatch.amount2;
    }

    return(
        <div class='col overflow-visible text-center align-middle position-relative'>
            <div class={'row' + visibility}>
                <div class='col border-bottom title'>Jippi Week 9</div>
            </div>

            <div class={'row' + visibility}>
                <div class='col name'>{player1Name}</div>
                <div class='col name'>{player2Name}</div>
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

            <BetBar visibility={visibility} amount1={amount1} amount2={amount2}/>
        </div>
    )
}

const SelectorList = connect(mapStateToProps)(ConnectedVisualizer);
export default SelectorList;