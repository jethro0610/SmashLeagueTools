import store from "../store/store";
const initialState = []

export const addNotification = notification => {
    return { type: 'ADD_NOTIFICATION', payload: {notification}};
}

export const clearNotification = notification => {
    return { type: 'CLEAR_NOTIFICATION' };
}

export const notificationReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'ADD_NOTIFICATION':
            // Ignore any existing notifications
            if (state.includes(action.payload.notification))
                return state;
            
            // Start the timer to clear the added notifications
            if(state.length === 0) {
                setTimeout(() => {
                    store.dispatch(clearNotification());
                }, process.env.REACT_APP_NOTIFICATION_TIME);
            }
            
            // Copy the array to a new one and add the notifications (required for Redux serlizing)
            state = state.slice();
            state.push(action.payload.notification)
            return state;
        
        case 'CLEAR_NOTIFICATION':
            // Copy the array to a new one and add delete the latest notification
            state = state.slice();
            state.shift();
            
            // Rerun the clear timer if there are still notifications
            if(state.length > 0) {
                setTimeout(() => {
                    store.dispatch(clearNotification());
                }, process.env.REACT_APP_NOTIFICATION_TIME);
            }
            return state;

        default:
            return state;
    }
};