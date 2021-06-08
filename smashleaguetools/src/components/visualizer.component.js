import React, {Component} from 'react';
import portrait from './../portrait.png'
import triangle from './../triangle.png'
import circle from './../circle.png'
import './visualizer.css'

export default class Visualizer extends Component {
    render() {
        return(
            <div class='col overflow-hidden text-center align-middle'>
                <div class='row'>
                    <div class='col border-bottom title'>Jippi Week 9</div>
                </div>

                <div class='row'>
                    <div class='col name'>Liar</div>
                    <div class='col name'>Pizza Steve</div>
                </div>

                <div class='row'>
                    <div class='col'><img src={triangle} class='triangle'/></div>
                    <div class='col'><img src={triangle} class='triangle'/></div>
                </div>

                <div class='row'>
                    <div class='col'>
                        <img src={portrait} class='col portrait'/>
                    </div>
                    <div class='col'>
                        <img src={portrait} class='col portrait flip'/>
                    </div>
                </div>

                <div class='row odds'>
                    <div class='col'>
                        $1000
                    </div>
                </div>

                <div class='row amounts border border-2 rounded-pill text-light progress'>
                    <div class='progress-bar w-50 bg-light text-dark text-start'>
                        $700
                    </div>
                    <div class='progress-bar w-50 bg-dark text-end'>
                        $300
                    </div>
                </div>
            </div>
        )
    }
}