import React, {Component} from 'react';
import SelectorList from './selectorList.component'
import Visualizer from './visualizer.component'
import './css/better.css'

export default class Better extends Component {
    render() {
        return(
            <div className='container-fluid better py-5'>
                <div className ='row align-items-center h-100'>
                    <SelectorList/>
                    <Visualizer/>
                </div>
            </div>
        )
    }
}