import React, {Component} from 'react';
import store from '../redux/store/store';
import {setSelectedMatch} from '../redux/reducers/selectedMatch';
import './css/selector.css'
import styled from 'styled-components';
import { textColor, pureWhiteSemiDark} from '../themeStyles';

const StyledSelector = styled.button`
    background-color: ${pureWhiteSemiDark};
    color: ${textColor};
    border: 0px;
`

export default class Selector extends Component {
    dispatchSelectedMatch = () =>{
        store.dispatch(setSelectedMatch(this.props.matchKey));
    }

    render() {
        return(
            <StyledSelector className='row px-0 mx-0 shadow selector rounded-pill overflow-hidden w-100' onClick={this.dispatchSelectedMatch}>
                <img src={process.env.REACT_APP_BACKEND_ORIGIN + '/images/logo'} className='selector-image' alt=''/> 
                <div className ='col px-0 align-middle text-start rounded'>{this.props.player1Name} vs. {this.props.player2Name}</div>
            </StyledSelector>
        )
    }
}