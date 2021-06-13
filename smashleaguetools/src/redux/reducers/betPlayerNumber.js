const initialState = {
    number: 0
}

export const setBetPlayerNumber = (playerNumber) => {
    return { type: 'SET_BET_PLAYERNUMBER', payload: {playerNumber} };
}

export const betPlayerNumberReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_BET_PLAYERNUMBER':
            return {
                number: action.payload.playerNumber
            }

        default:
            return state;
    }
};