const localStorage = window.localStorage;
const initialState = JSON.parse(localStorage.getItem('darkMode')); // Load the stored dark mode

export const setDarkMode = (darkMode) => {
    return { type: 'SET_DARK_MODE', payload: darkMode };
}

export const darkModeReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_DARK_MODE': {
            localStorage.setItem('darkMode', JSON.stringify(action.payload)); // Store dark mode setting
            return action.payload;
        }

        default:
            return state;
    }
};