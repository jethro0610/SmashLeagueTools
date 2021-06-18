import './css/prereg.css'

const PreReg = () => {
    return (
        <div className='container-fluid prereg'>
            <div className ='row align-items-center h-100'>
                <div className ='col text-center text-dark'>
                    The Return <br/>
                    6.19.2021   <br/>
                    <a rel='noopener noreferrer' target='_blank' 
                    href={process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/signup'} 
                    className='rounded-pill register'>Register on Smash.GG</a>
                </div>
            </div>
        </div>
    )
}

export default PreReg;