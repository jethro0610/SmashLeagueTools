import React from 'react';
import CirclePicture from './circlePicture.component';
import triangle from './../triangle.png'
import smashball from './../smashball.png'
import BetBar from './betbar.component.js'

import { setBetPredictionNumber } from '../redux/reducers/betInfo';
import store from '../redux/store/store';

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { selectedMatch: state.selectedMatch.match };
};

const ConnectedVisualizer = ({selectedMatch}) => {
    function onClickPlayer(playerNumber) {
        store.dispatch(setBetPredictionNumber(playerNumber));
    }

    var visibility = ' hide';
    var player1Name = '.';
    var player2Name = '.';
    var player1Img = 'http://localhost:5000/users/defaultprofilepicture';
    var player2Img = 'http://localhost:5000/users/defaultprofilepicture';
    var amount1 = 0;
    var amount2 = 0;
    if (selectedMatch !== undefined) {
        visibility = '';
        player1Name = selectedMatch.player1.name;
        player2Name = selectedMatch.player2.name;
        amount1 = selectedMatch.amount1;
        amount2 = selectedMatch.amount2;

        if(selectedMatch.player1.mongoId)
            player1Img = 'http://localhost:5000/users/' + selectedMatch.player1.mongoId + '/picture';

        if(selectedMatch.player1.mongoId)
            player1Img = 'http://localhost:5000/users/' + selectedMatch.player1.mongoId + '/picture';
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
                <div className={'col' + visibility}>
                    <CirclePicture 
                    onClick={() => onClickPlayer(1)} 
                    className='portrait-circle shadow' 
                    src={player1Img} 
                    style={{cursor: 'pointer'}}/>
                </div>
                <div className={'col' + visibility}>
                    <CirclePicture 
                    onClick={() => onClickPlayer(2)} 
                    className='portrait-circle shadow' 
                    src={player2Img} 
                    style={{cursor: 'pointer'}}/>
                </div>
            </div>

            <BetBar visibility={visibility} amount1={amount1} amount2={amount2}/>
        </div>
    )
}
//<img alt='' src={portrait} className={'col portrait shadow' + visibility}/>
const SelectorList = connect(mapStateToProps)(ConnectedVisualizer);
export default SelectorList;