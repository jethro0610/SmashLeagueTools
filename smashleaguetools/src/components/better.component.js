import React, {Component} from 'react';
import Selector from './selector.component'
import Visualizer from './visualizer.component'
import Match from './../match.js'
import './better.css'

export default class Better extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMatch: null,
            matches: Array(new Match('Player 1', 'Player 2'),
            new Match('Liar', 'Pizza Steve'))
        };
    }

    onSelectorClicked(match) {
        this.setState({
            selectedMatch: match
        });
    };

    render() {
        // Create selector HTML objects based on the number of current matches
        var selectors = [];
        for (var i = 0; i < this.state.matches.length; i++) {
            selectors.push(<Selector match={this.state.matches[i]} 
            buttonClick={this.onSelectorClicked.bind(this, this.state.matches[i])}/>); // Bind the click to the match being clicked
        }

        return(
            <div class='container-fluid'>
                <div class ='row align-items-center better'>
                    <div class='col-lg-4 px-5'>
                        {selectors}
                    </div>
                    <Visualizer match={this.state.selectedMatch}/>
                </div>
            </div>
        )
    }
}