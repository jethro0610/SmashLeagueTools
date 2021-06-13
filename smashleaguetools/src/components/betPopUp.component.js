import React from 'react';
import './css/betpopup.css'

const BetPopUp = () => {
    return (
        <div className='container-fluid position-fixed backdrop h-100'>
            <div className='row align-items-center h-100'>
                <div className='col'>
                    <div className='bg-light text-dark text-center shadow-lg popup d-flex flex-column'> 

                        <div className='titleBar bg-dark text-light overflow-hidden'>Place your bets </div>

                        <div className='row align-items-center h-100'>
                            <div className='betMenu col'>
                                <div className='playerName'>Liar</div>
                                <div className='currentAmount'>with 32% of $1000</div>

                                <div className='numberPadding'>
                                    <input type='number' min='0' max='100' className='form-control text-center' id='amount' placeholder='Amount'></input>
                                </div>
                                <button type='submit' className='btn btn-dark submitButton'>Submit</button>
                                <button type='submit' className='btn btn-dark submitButton'>Cancel</button>
                            </div>
                        </div>

                        <div className='balance'>Your Balance: $100</div>

                    </div>
                </div>
            </div>
        </div>
    )
};

export default BetPopUp;