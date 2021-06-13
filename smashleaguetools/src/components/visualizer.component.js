import React from 'react';
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
    var amount1 = 0;
    var amount2 = 0;
    if (selectedMatch != null) {
        visibility = '';
        player1Name = selectedMatch.player1Name;
        player2Name = selectedMatch.player2Name;
        amount1 = selectedMatch.amount1;
        amount2 = selectedMatch.amount2;
    }

    return(
        <div className='col overflow-visible text-center align-middle position-relative'>
            <div className={'row' + visibility}>
                <div className='col border-bottom title'>Jippi Week 9</div>
            </div>

            <div className={'row' + visibility}>
                <div className='col name'>{player1Name}</div>
                <div className='col name'>{player2Name}</div>
            </div>

            <div className={'row' + visibility}>
                <div className='col'><img alt='' src={triangle} className='triangle'/></div>
                <div className='col'><img alt='' src={triangle} className='triangle'/></div>
            </div>

            <div className='row'>
                <img alt='' src={smashball} className='smashball'/>
                <div className='col'>
                    <img alt='' src={portrait} className={'col portrait' + visibility}/>
                </div>
                <div className='col flip'>
                    <img alt='' src={portrait} className={'col portrait' + visibility}/>
                </div>
            </div>

            <BetBar visibility={visibility} amount1={amount1} amount2={amount2}/>
        </div>
    )
}

const SelectorList = connect(mapStateToProps)(ConnectedVisualizer);
export default SelectorList;