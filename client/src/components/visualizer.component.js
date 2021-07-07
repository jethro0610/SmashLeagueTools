import React from 'react';
import Poly from 'react-svg-polygon';
import CirclePicture from './circlePicture.component';
import BetBar from './betbar.component.js'
import Timer from './timer.component';
import './css/visualizer.css'
import { setBetPredictionNumber } from '../redux/reducers/betInfo';
import store from '../redux/store/store';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { textColor, visualizerCenterOpacity} from '../themeStyles';

const StyledTitle = styled.div`
    color: ${textColor};
    border-bottom: 1px solid ${textColor};
`
const StyledCenter = styled.img`
    opacity: ${visualizerCenterOpacity}
`

const mapStateToProps = state => {
    return { 
        selectedMatch: state.selectedMatch.match,  
        tournamentName: state.tournamentInfo.name
    };
};

const ConnectedVisualizer = ({selectedMatch, tournamentName}) => {
    // Open the bet pop up when a player is clicked
    function onClickPlayer(playerNumber) {
        store.dispatch(setBetPredictionNumber(playerNumber));
    }

    // Set the default variables when there's no match
    var visibility = ' hide';
    var player1Name = '.';
    var player2Name = '.';
    var player1Img, player2Img; 
    player1Img = player2Img = process.env.REACT_APP_BACKEND_ORIGIN + '/images/logo';
    var amount1 = 0;
    var amount2 = 0;
    var startTime = 0;

    // Assign the variables when there's a match
    if (selectedMatch !== undefined) {
        visibility = '';
        player1Name = selectedMatch.player1.name;
        player2Name = selectedMatch.player2.name;
        amount1 = selectedMatch.amount1;
        amount2 = selectedMatch.amount2;
        startTime = selectedMatch.startTime;
        
        if(selectedMatch.player1.mongoId)
            player1Img = process.env.REACT_APP_BACKEND_ORIGIN + '/users/' + selectedMatch.player1.mongoId + '/picture';

        if(selectedMatch.player2.mongoId)
            player2Img = process.env.REACT_APP_BACKEND_ORIGIN + '/users/' + selectedMatch.player2.mongoId + '/picture';
    }

    return(
        <div className='col overflow-visible text-center align-middle position-relative'>
            <div className={'row' + visibility}>
                <StyledTitle className='col title'>{tournamentName}</StyledTitle>
            </div>

            <div className={'row' + visibility}>
                <div className='col name'>{player1Name}</div>
                <div className='col name'>{player2Name}</div>
            </div>

            <div className={'row' + visibility}>
                <div className='col'><Poly cy={10} sides={3} r={20} fill={'#bd1111'} stroke={"none"} /></div>
                <div className='col'><Poly cy={10} sides={3} r={20} fill={"#2053ab"} stroke={"none"} /></div>
            </div>

            <div className='row'>
                <StyledCenter alt='' src={process.env.REACT_APP_BACKEND_ORIGIN + '/images/logo'} className='smashball'/>
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
            <Timer className={'bet-timer' + visibility} endTime={process.env.REACT_APP_MAX_BET_TIME} startTime={startTime} endText='No time left to bet'/>
        </div>
    )
}

const SelectorList = connect(mapStateToProps)(ConnectedVisualizer);
export default SelectorList;