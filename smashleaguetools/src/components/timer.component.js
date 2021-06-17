import {React, useEffect, useState} from 'react';

const Timer = (props) => {
    const [,setState]= useState();
    useEffect(() => {
        console.log('effect');
        setTimeout(() => {
            setState({});
        }, 500);
    })

    const pad = (i) => { return ('0'+i).slice(-2); }
    const timeDifference = Date.now() - props.startTime;
    const time = new Date(1000*Math.round(timeDifference/1000));

    const timeString = time.getUTCMinutes() + ':' + pad(time.getUTCSeconds());
    return(
        <div className={props.className}>{timeString}</div>
    )
}

export default Timer;