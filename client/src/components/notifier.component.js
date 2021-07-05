import { CSSTransition, SwitchTransition } from 'react-transition-group';
import React from 'react';
import './css/notifier.css'

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { notifications: state.notifications};
};

const ConnectedNotifier = React.forwardRef(({notifications}, ref) => {
    const nodeRef = React.useRef(null) // Required for animations

    // Set the current notification if there are any
    var currentNotification = 'no-notification';
    if (notifications[0])
        currentNotification = notifications[0];

    var returnDiv;
    if (currentNotification === 'no-notification') // Return empty div if there's no notification
        returnDiv = <div ref={nodeRef}/>;
    else { // Return the notifier if there are any notifications
        returnDiv = 
        <div ref={nodeRef} className="notifier-outer" >
            <div className="notifier bg-dark text-light rounded-pill shadow">
                {notifications[0]}
            </div>
        </div>
    }

    return (
    <SwitchTransition nodeRef={nodeRef}>
    <CSSTransition
    nodeRef={nodeRef}
    classNames="notif-anim"
    key={notifications[0]}
    timeout={300}
    >
        {returnDiv}
    </CSSTransition>
    </SwitchTransition>
    )
});

const Notifier = connect(mapStateToProps)(ConnectedNotifier);
export default Notifier;