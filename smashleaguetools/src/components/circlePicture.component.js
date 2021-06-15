const PicCircle = (props) => {
    var imageElement;
    if (props.src === undefined || props.src === '')
        imageElement = <div/>
    else
        imageElement = <img alt='' src={props.src} className='circle-pic'/>

    return(
        <div>
        <div className={(props.className === undefined ? '' : props.className) + ' circle-pic-outerborder'}>
            <div className='circle-pic-container'>
                {imageElement}
            </div>
        </div>
        </div>
    )
}

export default PicCircle;