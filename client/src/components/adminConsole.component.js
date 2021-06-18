import {React, useState} from 'react';
import store from '../redux/store/store'
import { addNotification } from '../redux/reducers/notifications';
import axios from 'axios';
import './css/profileUpdater.css'

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { 
        preregTitle: state.tournamentInfo.preregTitle,
        preregDate: state.tournamentInfo.preregDate,
        tournamentId: state.tournamentInfo.id
    }
}

const ConnectAdminConsole = ({preregTitle, preregDate, tournamentId, hasReg}) => {
    const [inPreregTitle, setInPreregTitle] = useState(preregTitle);
    const [inPreregDate, setInPreregDate] = useState(preregDate);
    const [inTournamentId, setInTournamentId] = useState(tournamentId);

    const handlePreregTitle = (e) => {
        setInPreregTitle(e.target.value);
    }

    const handlePreregDate = (e) => {
        setInPreregDate(e.target.value);
    }

    const handleTouramentId = (e) => {
        setInTournamentId(e.target.value);
    }

    const preRegSubmit = () => {
        const submitTitle = (inPreregTitle === undefined ? preregTitle : inPreregTitle);
        const submitDate = (inPreregDate === undefined ? preregDate : inPreregDate);

        axios.post(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/setprereg', {preregTitle: submitTitle, preregDate: submitDate, hasReg: false}, {withCredentials : true})
            .then(res => {
                store.dispatch(addNotification('Updated pre-registration'));
            })
            .catch(err => {
                store.dispatch(addNotification(err.response.data));
            })
    }

    const preRegEndSubmit = () => {
        const submitTitle = (inPreregTitle === undefined ? preregTitle : inPreregTitle);
        const submitDate = (inPreregDate === undefined ? preregDate : inPreregDate);

        axios.post(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/setpreregend', {preregTitle: submitTitle, preregDate: submitDate, hasReg: false}, {withCredentials : true})
            .then(res => {
                store.dispatch(addNotification('Updated pre-registration end'));
            })
            .catch(err => {
                store.dispatch(addNotification(err.response.data));
            })
    }

    const setTournament = () => {
        if (inTournamentId === undefined || inTournamentId.toString() === tournamentId.toString()) {
            store.dispatch(addNotification('Tournament already set'));
            return;
        }
        
        axios.post(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/set', {tournamentId: inTournamentId}, {withCredentials : true})
            .then(res => {
                store.dispatch(addNotification('Tournament set to ' + res.data.tournamentName));
            })
            .catch(err => {
                store.dispatch(addNotification(err.response.data));
            })
    }

    const startTournament = () => {
        axios.get(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/start', {withCredentials : true})
            .then(res => {
                
            })
            .catch(err => {
                store.dispatch(addNotification(err.response.data));
            })
    }

    const endTournament = () => {
        axios.get(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/end', {withCredentials : true})
            .then(res => {
                
            })
            .catch(err => {
                store.dispatch(addNotification(err.response.data));
            })
    }

    return(
        <div className='container-fluid h-100 text-center'>
        <div className='row align-items-center h-100'>
        <div className='col'>
            <input className='form-control text-center shadow' type='text' defaultValue={preregTitle} onChange={handlePreregTitle}/>
            <input className='form-control text-center shadow' type='text' defaultValue={preregDate} onChange={handlePreregDate}/>
            <button type='button' className='btn btn-dark' onClick={preRegSubmit}>Set Pre-registration</button>
            <button type='button' className='btn btn-dark' onClick={preRegEndSubmit}>Set Pre-registration end</button>
            <input className='form-control text-center shadow' type='text' defaultValue={tournamentId} onChange={handleTouramentId}/>
            <button type='button' className='btn btn-dark' onClick={setTournament}>Set Tournament</button>
            <button type='button' className='btn btn-dark' onClick={startTournament}>Start Tournament</button>
            <button type='button' className='btn btn-dark' onClick={endTournament}>End Tournament</button>
        </div>
        </div>
        </div>
    )
}

const AdminConsole = connect(mapStateToProps)(ConnectAdminConsole);
export default AdminConsole;