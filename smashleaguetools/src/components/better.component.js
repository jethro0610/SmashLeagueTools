import React, {Component} from 'react';
import Selector from './selector.component'
import Visualizer from './visualizer.component'
import './better.css'

export default class Better extends Component {
    render() {
        return(
            <div class='container-fluid'>
                <div class ='row align-items-center better'>
                    <div class='col-lg-4'>
                        <Selector/>
                        <Selector/>
                        <Selector/>
                        <Selector/>
                    </div>
                    <Visualizer/>
                </div>
            </div>
        )
    }
}