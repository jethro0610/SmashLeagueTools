const initialState = {
    predictionNumber: 0,
    amount: undefined
}

export const setBetPredictionNumber = (predictionNumber) => {
    return { type: 'SET_BET_PREDICTIONNUMBER', payload: {predictionNumber} };
}

export const cancelBet = () => {
    return { type: 'CANCEL_BET' };
}

export const setBetAmount = (amount) => {
    return { type: 'SET_BET_AMOUNT', payload: {amount} };
}

export const betInfoReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_BET_PREDICTIONNUMBER':
            return {
                predictionNumber: action.payload.predictionNumber,
                amount: state.amount
            }

        case 'CANCEL_BET': {
            return initialState;
        }

        case 'SET_BET_AMOUNT': {
            return {
                predictionNumber: state.predictionNumber,
                amount: action.payload.amount
            }
        }

        default:
            return state;
    }
};