const initialState = {
    name: undefined,
    balance: 0,
    admin:false
};

export const setUser = (name, balance, admin = false) => {
    return { type: 'SET_USER', payload: {name, balance, admin}};
}

export const setBalance = (balance) => {
    return { type: 'SET_BALANCE', payload: {balance}};
}

export const userInfoReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_USER':
            return {
                name: action.payload.name,
                balance: action.payload.balance,
                admin: action.payload.admin
            }

        case 'SET_BALANCE':
            return {
                name: state.name,
                balance: action.payload.balance,
                admin: state.admin
            }

        default:
            return state;
    }
};