import React from 'react';

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { selectedMatch: state.selectedMatch.match };
};

const ConnectedBetBar = ({selectedMatch}) =>  {
    var visibility = 'hide';
    var amount1 = 0;
    var amount2 = 0;

    if(selectedMatch !== undefined) {
        visibility = '';
        amount1 = selectedMatch.amount1;
        amount2 = selectedMatch.amount2;
    }

    // Set the progress to 50/50 if the amounts are 0
    var progress1 = 50;
    var progress2 = 50;

    // Set the progress if the amounts are available
    if(amount1 !== 0 || amount2 !== 0) {
        // Calculate the widths of the progress bars
        progress1 = (amount1 / (amount1 + amount2)) * 100.0;
        progress1 = (isNaN(progress1) ? 0 : progress1); // Ensure that progress1 doesn't NaN
        progress2 = 100.0 - progress1;
    }

    const barClass1 = 'progress-bar bg-light text-dark text-start overflow-hidden';
    const barClass2 = 'progress-bar bg-dark text-light text-end overflow-hidden';
    const barElement1 = 
    <div className={barClass1} style={{width: progress1 + '%'}} aria-valuenow={progress1} aria-valuemin={0} aria-valuemax={100}>
        <div className='px-2'> ${amount1} </div>
    </div>;

    const barElement2 = 
    <div className={barClass2} style={{width: progress2 + '%'}} aria-valuenow={progress2} aria-valuemin={0} aria-valuemax={100}>
        <div className='px-2'> ${amount2} </div>
    </div>;

    return(
        <div className={visibility}>
            <div className={'row'}>
                <div className='col total'>
                    {'$' + (amount1 + amount2)}
                </div>
            </div>
            <div className={'row'}>
                <div className='col'>
                    <div className='betbar shadow-sm border border-2 rounded-pill text-light progress overflow-hidden'>
                        {barElement1}
                        {barElement2}
                    </div>
                </div>
            </div>
        </div>
    )
}

const BetBar = connect(mapStateToProps)(ConnectedBetBar);
export default BetBar;