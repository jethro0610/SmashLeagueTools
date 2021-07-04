import './css/circlePicture.css'

import styled from 'styled-components';
import { pureWhiteSemiDark } from '../themeStyles';

const OuterBorder = styled.div`
  background-color: ${pureWhiteSemiDark};
`

const CirclePicture = (props) => {
    var imageElement;
    if (props.src === undefined || props.src === '')
        imageElement = <div/>
    else
        imageElement = <img alt='' src={props.src} className='circle-pic'/>

    return(
        <OuterBorder 
        className={(props.className === undefined ? '' : props.className) + ' circle-pic-outerborder'}
        style={props.style}
        onClick={props.onClick}
        >
            <div className='circle-pic-container'>
                {imageElement}
            </div>
        </OuterBorder>
    )
}

export default CirclePicture;