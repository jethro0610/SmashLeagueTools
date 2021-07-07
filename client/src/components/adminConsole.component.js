import {React, useState} from 'react';
import store from '../redux/store/store'
import { addNotification } from '../redux/reducers/notifications';
import axios from 'axios';
import './css/profileUpdater.css'
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return { 
        titleCard: state.tournamentInfo.titleCard,
        subtitleCard: state.tournamentInfo.subtitleCard,
        phaseGroupId: state.tournamentInfo.phaseGroupId
    }
}

const ConnectAdminConsole = ({titleCard, subtitleCard, phaseGroupId}) => {
    const [logo, setLogo] = useState(undefined);
    const [inTitleCard, setInTitleCard] = useState(titleCard);
    const [inSubtitleCard, setInSubtitleCard] = useState(subtitleCard);
    const [inPhaseGroupId, setInPhaseGroupId] = useState(phaseGroupId);

    const handleTitleCard = (e) => {
        setInTitleCard(e.target.value);
    }

    const handleSubtitleCard = (e) => {
        setInSubtitleCard(e.target.value);
    }

    const handlePhaseGroupId = (e) => {
        setInPhaseGroupId(e.target.value);
    }

    const titleCardSubmit = () => {
        const submitTitle = (inTitleCard === undefined ? titleCard : inTitleCard); // Set submit title to its default if it's undefined
        const submitSubtitle = (inSubtitleCard === undefined ? subtitleCard : inSubtitleCard); // Set submit subtitle to its default if it's undefined

        // Update the title card on the backend
        axios.post(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/settitlecard', {titleCard: submitTitle, subtitleCard: submitSubtitle, hasRegistration: true}, {withCredentials : true})
            .then(res => {
                store.dispatch(addNotification('Updated pre-registration'));
            })
            .catch(err => {
                console.log(err);
            })
    }

    const titleCardSubmitEnd = () => {
        const submitTitle = (inTitleCard === undefined ? titleCard : inTitleCard); // Set submit title to its default if it's undefined
        const submitSubtitle = (inSubtitleCard === undefined ? subtitleCard : inSubtitleCard); // Set submit subtitle to its default if it's undefined

        // Update the end card on the backend
        axios.post(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/settitlecardend', {titleCard: submitTitle, subtitleCard: submitSubtitle, hasRegistration: false}, {withCredentials : true})
            .then(res => {
                store.dispatch(addNotification('Updated pre-registration'));
            })
            .catch(err => {
                console.log(err);
            })
    }

    const setTournament = () => {
        // Update the tournament on the backend
        axios.post(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/set', {phaseGroupId: inPhaseGroupId}, {withCredentials : true})
            .then(res => {
                store.dispatch(addNotification('Tournament set to ' + res.data.name));
            })
            .catch(err => {
                store.dispatch(addNotification(err.response.data));
            })
    }

    const startTournament = () => {
        // Start the tournament on the backend
        axios.get(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/start', {withCredentials : true})
            .then(res => {
                
            })
            .catch(err => {
                store.dispatch(addNotification(err.response.data));
            })
    }

    const endTournament = () => {
        // End the tournament on the backend
        axios.get(process.env.REACT_APP_BACKEND_ORIGIN + '/tournament/end', {withCredentials : true})
            .then(res => {
                
            })
            .catch(err => {
                store.dispatch(addNotification(err.response.data));
            })
    }

    const logoChange = (e) => {
        e.preventDefault();
        setLogo(e.target.files[0]);
    }

    const logoSubmit = (e) => {
        e.preventDefault();
        if (logo === undefined) return;

        const formData = new FormData();
        formData.append('logo', logo);

        // Send the information to update the profile
        axios.post(process.env.REACT_APP_BACKEND_ORIGIN + '/images/setlogo', formData, {withCredentials : true})
            .then(res => {
                window.location.reload(); // Reload the page to update cached image
            })
            .catch(err => {
                store.dispatch(addNotification(err.response.data));
            })
    }

    return(
        <div className='container-fluid h-100 text-center'>
        <div className='row align-items-center h-100'>
        <div className='col'>
            <input className='form-control text-center shadow' type='text' defaultValue={titleCard} onChange={handleTitleCard}/>
            <input className='form-control text-center shadow' type='text' defaultValue={subtitleCard} onChange={handleSubtitleCard}/>
            <button type='button' className='btn btn-dark' onClick={titleCardSubmit}>Set Pre-registration</button>
            <button type='button' className='btn btn-dark' onClick={titleCardSubmitEnd}>Set Pre-registration end</button>
            <input className='form-control text-center shadow' type='text' defaultValue={phaseGroupId} onChange={handlePhaseGroupId}/>
            <button type='button' className='btn btn-dark' onClick={setTournament}>Set Tournament</button>
            <button type='button' className='btn btn-dark' onClick={startTournament}>Start Tournament</button>
            <button type='button' className='btn btn-dark' onClick={endTournament}>End Tournament</button>
            <form encType='multipart/form-data' onSubmit={logoSubmit}>
                <div class="form-group">
                <button type="submit" class="btn btn-dark">Update Logo</button>
                <label for="exampleFormControlFile1"></label>
                <input 
                    type="file" 
                    accept=".png, .jpg, .jpeg"
                    name='logo'
                    id='logo'
                    onChange={logoChange}
                />
                </div>
            </form>
        </div>

        </div>
        </div>
    )
}

const AdminConsole = connect(mapStateToProps)(ConnectAdminConsole);
export default AdminConsole;