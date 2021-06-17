import {React, useEffect, useState} from 'react';

const Timer = (props) => {
    const [,setState]= useState();
    useEffect(() => {
        setTimeout(() => {
            setState({});
        }, 500);
    })

    const pad = (i) => { return ('0'+i).slice(-2); }
    const timeDifference = props.endTime - (Date.now() - props.startTime);
    if (timeDifference < 0) {
        if(props.endText)
            return(<div className={props.className}>{props.endText}</div>)
        return(<div className={props.className}>0:00</div>)
    }

    const time = new Date(1000*Math.round(timeDifference/1000));
    const timeString = time.getUTCMinutes() + ':' + pad(time.getUTCSeconds());
    return(<div className={props.className}>{timeString}</div>)
}

export default Timer;