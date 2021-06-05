import React, {Component} from 'react';
import './better.css'

export default class Better extends Component {
    render() {
        return(
            <div class='container-fluid px-5'>
                <div class ='row min-vh-100'>
                    <div class='col-lg-6 col-sm-12 selector'>Column 1</div>
                    <div class='col-lg-6 col-sm-12 visualizer'>Column 2</div>
                </div>
            </div>
        )
    }
}