import React, {Component} from 'react';
import './visualizer.css'

export default class BetBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0
        };
    }

    render() {
        const visibility = this.props.visibility;
        const amount1 = this.props.amount1;
        const amount2 = this.props.amount2;

        // Calculate the widths of the progress bars
        var progress1 = (amount1 / (amount1 + amount2)) * 100.0;
        var progress2 = 100.0 - progress1;

        // Create the progress bar elements if their widths are > 0
        var barElement1 = null;
        var barElement2 = null;
        if (progress1 >= 5.0) {
            barElement1 = 
            <div class={'progress-bar bg-light text-dark text-start overflow-hidden' + visibility} style={{width: progress1 + '%'}}>
                { progress1 > 10.0 ? '$' + amount1 : '' }
            </div>;
        }

        if (progress2 >= 5.0) {
            barElement2 = 
            <div class={'progress-bar bg-dark text-light text-end overflow-hidden' + visibility} style={{width: progress2 + '%'}}>
                { progress2 > 10.0 ? '$' + amount2 : '' }
            </div>;
        }

        return(
            <div>
                <div class={'row' + visibility + visibility}>
                    <div class='col amount'>
                        {'$' + (amount1 + amount2)}
                    </div>
                </div>
                <div class={'row amounts shadow-sm border border-2 rounded-pill text-light progress' + visibility}>
                    {barElement1}
                    {barElement2}
                </div>
            </div>
        )
    }
}