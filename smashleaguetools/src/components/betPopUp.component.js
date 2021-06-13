import React from 'react';
import './css/betpopup.css'
import BetBar from './betbar.component'

const BetPopUp = () => {
    return (
        <div className='container-fluid position-absolute backdrop'>
            <div className='position-absolute'></div>
            <div className='row align-items-center vh-100'>
                <div className='col'>
                    <div className='bg-light text-dark text-center shadow-lg popup'> 
                        <div className='titleBar bg-dark text-light overflow-hidden'>Place your bets </div>
                        <div className='betMenu'>
                            <div className='playerName'>Liar</div>
                            <div className='currentAmount'>Your balance: $500</div>

                            <div className='numberPadding'>
                                <input type='number' min='0' max='100' class='form-control text-center' id="amount" placeholder="Amount"></input>
                                <button type="submit" class="btn btn-dark submitButton">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default BetPopUp;