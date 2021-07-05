const localStorage = window.localStorage;
const initialState = JSON.parse(localStorage.getItem('darkMode'));

export const setDarkMode = (darkMode) => {
    return { type: 'SET_DARK_MODE', payload: darkMode };
}

export const darkModeReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_DARK_MODE': {
            localStorage.setItem('darkMode', JSON.stringify(action.payload));
            return action.payload;
        }

        default:
            return state;
    }
};