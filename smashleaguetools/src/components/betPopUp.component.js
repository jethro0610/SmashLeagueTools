import React from 'react';
import './css/betpopup.css'
import { setBetPlayerNumber } from '../redux/reducers/betPlayerNumber';
import store from '../redux/store/store';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return { 
        betPlayerNumber: state.betPlayerNumber.number,
        selectedMatch: state.selectedMatch.match
    };
};

const ConnectBetPopUp = ({betPlayerNumber, selectedMatch}) => {
    if (betPlayerNumber === 0 || selectedMatch === 0)
        return (
            <div/>
        );

    var playerName = '';
    var playerAmount = 0;
    if (betPlayerNumber === 1) {
        playerName = selectedMatch.player1Name;
        playerAmount = selectedMatch.amount1;
    }
    else if(betPlayerNumber === 2) {
        playerName = selectedMatch.player2Name
        playerAmount = selectedMatch.amount2;
    }
    var total = selectedMatch.amount1 + selectedMatch.amount2;
    var percent = (playerAmount / total) * 100.0;
    percent = (isNaN(percent) ? 0 : percent);

    return (
        <div className='container-fluid position-fixed backdrop h-100'>
            <div className='row align-items-center h-100'>
                <div className='col'>
                    <div className='bg-light text-dark text-center shadow-lg popup d-flex flex-column'> 

                        <div className='titleBar bg-dark text-light overflow-hidden'>Place your bets </div>

                        <div className='row align-items-center h-100'>
                            <div className='betMenu col'>
                                <div className='playerName'>{playerName}</div>
                                <div className='currentAmount'>with {percent.toFixed(2)}% of ${total}</div>

                                <div className='numberPadding'>
                                    <input type='number' min='0' max='100' className='form-control text-center' id='amount' placeholder='Amount'></input>
                                </div>
                                <button type='submit' className='btn btn-dark submitButton'>Submit</button>
                                <button onClick={() => {store.dispatch(setBetPlayerNumber(0))}} type='submit' className='btn btn-dark submitButton'>Cancel</button>
                            </div>
                        </div>

                        <div className='balance'>Your Balance: $100</div>

                    </div>
                </div>
            </div>
        </div>
    )
};

const BetPopUp = connect(mapStateToProps)(ConnectBetPopUp);
export default BetPopUp;