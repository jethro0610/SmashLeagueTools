import React, {Component} from 'react';
import Selector from './selector.component'
import Visualizer from './visualizer.component'
import allMatches from './../match.js'
import './better.css'

export default class Better extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMatchKey: null,
        };

        this.onMatchUpdate = this.onMatchUpdate.bind(this);
    }

    // Force component to update when new matches are sent
    onMatchUpdate() {
        // Set the selected match to null if it was deleted
        if (!allMatches.has(this.state.selectedMatchKey))
            this.state.selectedMatchKey = null;
            
        this.forceUpdate();
    }

    // Bind functions on mount
    componentDidMount(){
        window.addEventListener('updateMatches', this.onMatchUpdate);
    }

    // Unbind on unmount
    componentWillUnmount() {
        window.removeEventListener('updateMatches', this.onMatchUpdate);
    }

    onSelectorClicked(matchKey) {
        this.setState({
            selectedMatchKey: matchKey
        });
    };

    render() {
        // Create selector HTML objects based on the number of current matches
        var selectors = [];
        for (const k of allMatches.keys()) {
            selectors.push(<Selector match={allMatches.get(k)} 
            buttonClick={this.onSelectorClicked.bind(this, k)}
            key={k}/>); // Bind the click to the match being clicked
        }

        return(
            <div class='container-fluid'>
                <div class ='row align-items-center better'>
                    <div class='col-lg-4 px-5'>
                        {selectors}
                    </div>
                    <Visualizer match={allMatches.get(this.state.selectedMatchKey)}/>
                </div>
            </div>
        )
    }
}