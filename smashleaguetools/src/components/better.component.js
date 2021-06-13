import React, {Component} from 'react';
import SelectorList from './selectorList.component'
import Visualizer from './visualizer.component'
import './better.css'

export default class Better extends Component {
    render() {
        // Create selector HTML objects based on the number of current matches
        return(
            <div className='container-fluid'>
                <div className ='row align-items-center better'>
                    <SelectorList/>
                    <Visualizer/>
                </div>
            </div>
        )
    }
}