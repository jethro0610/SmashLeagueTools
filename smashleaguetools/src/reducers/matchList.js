import matches from './../match';

const initialState = {
    matchList: []
}

const matchListReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'CREATE_MATCH':
            var createdMatch = matches.get(action.payload);
            if (createdMatch == null) return state;
            return {
                ...state,
                    matchList: [
                        ...state.matchList, {
                            key: action.payload,
                            player1Name: createdMatch.player1,
                            player2Name: createdMatch.player2
                        }
                    ]
            }
            /*
        case 'ALL_MATCHES':
            matchArray = [];
            for (const k of this.state.matches.keys()) {
                var createdMatch = matches.get(action.payload.key);
                matchArray.push({
                        key: k,
                        player1Name: createdMatch.player1,
                        player2Name: createdMatch.player2
                    }
                );
            }
            return {
                state: {
                    matchList: matchArray
                }
            }
*/
        default:
            return state;
    }
};

export default matchListReducer;