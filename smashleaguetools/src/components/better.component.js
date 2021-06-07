import React, {Component} from 'react';
import Selector from './selector.component'
import './better.css'

export default class Better extends Component {
    render() {
        return(
            <div class='container-fluid'>
                <div class ='row min-vh-100'>
                    <div class='col-lg-4 col-sm-8 selectors'>
                        <div class='container'>
                            <Selector/>
                            <Selector/>
                            <Selector/>
                            <Selector/>
                        </div>
                    </div>
                    <div class='col-lg-8 col-sm-16 visualizer'>Column 2</div>
                </div>
            </div>
        )
    }
}