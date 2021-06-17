import './css/circlePicture.css'

const CirclePicture = (props) => {
    var imageElement;
    if (props.src === undefined || props.src === '')
        imageElement = <div/>
    else
        imageElement = <img alt='' src={props.src} className='circle-pic'/>

    return(
        <div 
        className={(props.className === undefined ? '' : props.className) + ' circle-pic-outerborder'}
        style={props.style}
        onClick={props.onClick}
        >
            <div className='circle-pic-container'>
                {imageElement}
            </div>
        </div>
    )
}

export default CirclePicture;