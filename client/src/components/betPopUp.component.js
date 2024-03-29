import React from 'react';
import { cancelBet, setBetAmount } from '../redux/reducers/betInfo';
import store from '../redux/store/store';
import { connect } from 'react-redux';
import {socket} from '../socketmanager'
import './css/betpopup.css'
import styled from 'styled-components';
import { textColor, mainBackgroundColor, backgroundColor} from '../themeStyles';

const StyledPopUp = styled.div`
    background-color: ${mainBackgroundColor};
    color: ${textColor};
`
const StyledBalance = styled.div`
    background-color: ${backgroundColor};
    color: ${textColor};
`

const mapStateToProps = state => {
    return { 
        betInfo: state.betInfo,
        selectedMatch: state.selectedMatch.match,
        balance: state.userInfo.balance
    };
};

const ConnectBetPopUp = ({betInfo, selectedMatch, balance}) => {
    // Return no pop up if there's no bet to place
    if (betInfo.predictionNumber === 0 || selectedMatch === undefined)
        return (
            <div/>
        );
    
    // Set the bet variables
    var playerName = '';
    var playerAmount = 0;
    if (betInfo.predictionNumber === 1) {
        playerName = selectedMatch.player1.name;
        playerAmount = selectedMatch.amount1;
    }
    else if(betInfo.predictionNumber === 2) {
        playerName = selectedMatch.player2.name
        playerAmount = selectedMatch.amount2;
    }

    // Calcualte the total and percent of bets on the given player
    const total = selectedMatch.amount1 + selectedMatch.amount2;
    var percent = (playerAmount / total) * 100.0;
    percent = (isNaN(percent) ? 0 : percent);

    const handleChange = (e) => {
        store.dispatch(setBetAmount(e.target.value));
    }

    const handleSubmit = () => {
        socket.emit('bet', {key: selectedMatch.key, predictionNumber: betInfo.predictionNumber, amount: betInfo.amount});
    }

    return (
        <div className='container-fluid position-fixed backdrop h-100'>
        <div className='row align-items-center h-100'>
        <div className='col'>

            {/* The popup*/}
            <StyledPopUp className='text-center shadow-lg popup d-flex flex-column'> 
                {/* The title bar*/}
                <div className='titleBar bg-dark text-light overflow-hidden'>Place your bets </div>

                {/* Content area*/}
                <div className='row align-items-center h-100'>
                    <div className='betMenu col'>
                        {/* Player bet*/}
                        <div className='playerName'>{playerName}</div>
                        <div className='currentAmount'>with {percent.toFixed(2)}% of ${total}</div>
                        

                        {/* Input form */}
                        <div className='numberPadding'>
                            <input onChange={handleChange} type='number' min='0' max={balance} className='form-control text-center' id='amount' placeholder='Amount'></input>
                        </div>

                        {/* Buttons */}
                        <button onClick={handleSubmit} type='submit' className='btn btn-dark submitButton'>Submit</button>
                        <button onClick={() => {store.dispatch(cancelBet())}} type='submit' className='btn btn-dark submitButton'>Cancel</button>
                    </div>
                </div>

                {/* Bottom area*/}
                <StyledBalance className='balance'>Your Balance: ${balance}</StyledBalance>
            </StyledPopUp>

        </div>
        </div>
        </div>
    )
};

const BetPopUp = connect(mapStateToProps)(ConnectBetPopUp);
export default BetPopUp;