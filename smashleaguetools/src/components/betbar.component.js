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
        // Determine the visibility of the bar and calculate the totals
        var visibility = ' hide';
        var total1 = 0;
        var total2 = 0;
        if (this.props.match != null) {
            visibility = '';
            total1 = this.props.match.total1;
            total2 = this.props.match.total2;
        }

        // Calculate the widths of the progress bars
        var progress1 = (total1 / (total1 + total2)) * 100.0;
        var progress2 = 100.0 - progress1;

        // Create the progress bar elements if their widths are > 0
        var barElement1 = null;
        var barElement2 = null;
        if (progress1 >= 5.0) {
            barElement1 = 
            <div class={'progress-bar bg-light text-dark text-start overflow-hidden'} style={{width: progress1 + '%'}}>
                { progress1 > 10.0 ? '$' + total1 : '' }
            </div>;
        }

        if (progress2 >= 5.0) {
            barElement2 = 
            <div class={'progress-bar bg-dark text-light text-end overflow-hidden'} style={{width: progress2 + '%'}}>
                { progress2 > 10.0 ? '$' + total2 : '' }
            </div>;
        }

        return(
            <div>
                <div class={'row' + visibility}>
                    <div class='col amount'>
                        {'$' + (total1 + total2)}
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