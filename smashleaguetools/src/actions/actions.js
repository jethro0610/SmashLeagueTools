export default function createMatch(matchKey) {
    return { type: 'CREATE_MATCH', payload: matchKey};
}