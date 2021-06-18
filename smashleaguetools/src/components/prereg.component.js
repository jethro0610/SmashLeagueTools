import './css/prereg.css'
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return { 
        preregTitle: state.tournamentInfo.preregTitle,
        preregDate: state.tournamentInfo.preregDate
    };
};
  

const ConnectPreReg = ({preregTitle, preregDate}) => {
    return (
        <div className='container-fluid prereg'>
            <div className ='row align-items-center h-100'>
                <div className ='col text-center text-dark'>
                    {preregTitle}<br/>
                    {preregDate}<br/>
                    <a rel='noopener noreferrer' target='_blank' 
                    href={process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/signup'} 
                    className='rounded-pill register'>Register on smash.gg</a>
                </div>
            </div>
        </div>
    )
}

const PreReg = connect(mapStateToProps)(ConnectPreReg);
export default PreReg;