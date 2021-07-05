const initialState = false

export const setDarkMode = (darkMode) => {
    return { type: 'SET_DARK_MODE', payload: darkMode };
}

export const darkModeReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_DARK_MODE':
            return action.payload;

        default:
            return state;
    }
};