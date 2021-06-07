import React, {Component} from 'react';
import portrait from './../portrait.png'
import './visualizer.css'

export default class Visualizer extends Component {
    render() {
        return(
            <div class='col-lg-8 px-0 bg-light overflow-hidden vh-100'>
                <div class='row vis w-100'>
                    <img src={portrait} class='portrait'/>
                    <div class ='col px-0'>Liar</div>
                </div>

                <div class='row vis-mid'>
                    <div class='col'>50</div>
                </div>

                <div class='row vis'>
                    <div class ='col px-0 text-end'>Pizza Steve</div>
                    <img src={portrait} class='portrait flip'/>
                </div>
            </div>
        )
    }
}