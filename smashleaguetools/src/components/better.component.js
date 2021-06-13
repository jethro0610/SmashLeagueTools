import React, {Component} from 'react';
import SelectorList from './selectorList.component'
import Visualizer from './visualizer.component'
import './better.css'

export default class Better extends Component {
    onSelectorClicked() {

    }

    render() {
        // Create selector HTML objects based on the number of current matches
        return(
            <div class='container-fluid'>
                <div class ='row align-items-center better'>
                    <SelectorList/>
                    <Visualizer/>
                </div>
            </div>
        )
    }
}