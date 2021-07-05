import {React, useEffect, useState} from 'react';

const Timer = (props) => {
    // Update the timer every half second
    const [,setState]= useState();
    useEffect(() => {
        setTimeout(() => {
            setState({});
        }, 500);
    })

    const pad = (i) => { return ('0'+i).slice(-2); } // Add the leading 0 to the seconds
    const timeDifference = props.endTime - (Date.now() - props.startTime); // Get the difference between the timers start time and now

    // Return the end text if the timer ran out
    if (timeDifference < 0) {
        if(props.endText)
            return(<div className={props.className}>{props.endText}</div>)
        return(<div className={props.className}>0:00</div>)
    }

    // Set the timer string to the given time and return
    const time = new Date(1000*Math.round(timeDifference/1000));
    const timeString = time.getUTCMinutes() + ':' + pad(time.getUTCSeconds());
    return(<div className={props.className}>{timeString}</div>)
}

export default Timer;