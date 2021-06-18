import './css/prereg.css'
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return { 
        preregTitle: state.tournamentInfo.preregTitle,
        preregDate: state.tournamentInfo.preregDate,
        hasReg: state.tournamentInfo.hasReg
    };
};
  

const ConnectPreReg = ({preregTitle, preregDate, hasReg}) => {
    var endElemements = undefined;
    if (hasReg) {
        endElemements =    
        <div>
            {preregDate}<br/>
            <a rel='noopener noreferrer' target='_blank' 
            href={process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/signup'} 
            className='rounded-pill register'>Register on smash.gg</a>
        </div>
    }
    
    return (
        <div className='container-fluid prereg'>
            <div className ='row align-items-center h-100'>
                <div className ='col text-center text-dark'>
                    {preregTitle}<br/>
                    {endElemements}
                </div>
            </div>
        </div>
    )
}

const PreReg = connect(mapStateToProps)(ConnectPreReg);
export default PreReg;