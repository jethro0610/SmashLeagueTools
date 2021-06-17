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
            if(state.length === 0) {
                setTimeout(() => {
                    store.dispatch(clearNotification());
                }, 2000);
            }
            
            state = state.slice();
            state.push(action.payload.notification)
            return state;
        
        case 'CLEAR_NOTIFICATION':
            state = state.slice();
            state.shift();
            
            if(state.length > 0) {
                setTimeout(() => {
                    store.dispatch(clearNotification());
                }, 2000);
            }
            return state;

        default:
            return state;
    }
};