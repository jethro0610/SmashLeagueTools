import React, {Component} from 'react';
import Selector from './selector.component'
import Visualizer from './visualizer.component'
import './better.css'

export default class Better extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: Array(3),
            currentMatch: null
        };
    }

    render() {
        var selectors = [];
        for (var i=0; i < this.state.matches.length; i++)
            selectors.push(<Selector name1='Liar' name2='Pizza Steve'/>);

        return(
            <div class='container-fluid'>
                <div class ='row align-items-center better'>
                    <div class='col-lg-4'>
                        {selectors}
                    </div>
                    <Visualizer/>
                </div>
            </div>
        )
    }
}