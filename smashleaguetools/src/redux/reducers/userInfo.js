const initialState = {
    name: undefined,
    balance: 0,
    ggSlug: undefined,
    admin:false
};

export const setUser = (id, name, balance, ggSlug, admin = false) => {
    return { type: 'SET_USER', payload: {id, name, balance, ggSlug, admin}};
}

export const setName = (name) => {
    return { type: 'SET_NAME', payload: {name}};
}

export const setBalance = (balance) => {
    return { type: 'SET_BALANCE', payload: {balance}};
}

export const userInfoReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_USER':
            return {
                id: action.payload.id,
                name: action.payload.name,
                ggSlug: action.payload.ggSlug,
                balance: action.payload.balance,
                admin: action.payload.admin
            }
        
        case 'SET_NAME': 
            return {
                id: state.id,
                name: action.payload.name,
                ggSlug: state.ggSlug,
                balance: state.balance,
                admin: state.admin
            }

        case 'SET_BALANCE':
            return {
                id: state.id,
                name: state.name,
                ggSlug: state.ggSlug,
                balance: action.payload.balance,
                admin: state.admin
            }

        default:
            return state;
    }
};