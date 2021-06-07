import React, {Component} from 'react';
import Selector from './selector.component'
import Visualizer from './visualizer.component'
import './better.css'

export default class Better extends Component {
    render() {
        return(
            <div class='container-fluid'>
                <div class ='row'>
                    <div class='col-lg-4 selectors'>
                        <div class='container'>
                            <Selector/>
                            <Selector/>
                            <Selector/>
                            <Selector/>
                        </div>
                    </div>
                    <Visualizer/>
                </div>
            </div>
        )
    }
}