import React from 'react';
import Selector from './selector.component'

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { matchList: state.matchList.list };
};

const ConnectedSelectorList = ({matchList}) => {
    return (
    <div className='col-lg-4 px-5'>
        {matchList.map(match => (
            <Selector key={match.key} matchKey={match.key} player1Name={match.player1Name} player2Name={match.player2Name}/>
        ))}
    </div>)
};

const SelectorList = connect(mapStateToProps)(ConnectedSelectorList);
export default SelectorList;