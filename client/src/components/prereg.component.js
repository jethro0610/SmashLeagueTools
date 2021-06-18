import './css/prereg.css'
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return { 
        titleCard: state.tournamentInfo.titleCard,
        subtitleCard: state.tournamentInfo.subtitleCard,
        hasRegistration: state.tournamentInfo.hasRegistration
    };
};
  

const ConnectPreReg = ({titleCard, subtitleCard, hasRegistration}) => {
    var endElemements = undefined;
    if (hasRegistration) {
        endElemements =    
        <div>
            {subtitleCard}<br/>
            <a rel='noopener noreferrer' target='_blank' 
            href={process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/signup'} 
            className='rounded-pill register'>Register on smash.gg</a>
        </div>
    }
    
    return (
        <div className='container-fluid prereg'>
            <div className ='row align-items-center h-100'>
                <div className ='col text-center text-dark'>
                    {titleCard}<br/>
                    {endElemements}
                </div>
            </div>
        </div>
    )
}

const PreReg = connect(mapStateToProps)(ConnectPreReg);
export default PreReg;