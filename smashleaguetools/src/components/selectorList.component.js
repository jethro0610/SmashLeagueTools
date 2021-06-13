import React from 'react';
import Selector from './selector.component'
import './better.css'

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { matchList: state.matchList.list };
};

const ConnectedSelectorList = ({matchList}) => {
    return (
    <div class='col-lg-4 px-5'>
        {matchList.map(match => (
            <Selector matchKey={match.key} player1Name={match.player1Name} player2Name={match.player2Name}/>
        ))}
    </div>)
};

const SelectorList = connect(mapStateToProps)(ConnectedSelectorList);
export default SelectorList;