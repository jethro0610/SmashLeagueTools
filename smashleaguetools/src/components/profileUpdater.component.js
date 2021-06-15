import {React, useState} from 'react';
import axios from 'axios';
import CirclePicture from './circlePicture.component';

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { 
        name: state.userInfo.name,
        id: state.userInfo.id,
        userggSlug: state.userInfo.ggSlug
    }
}

const ConnectedProfileUpdater = ({name, id, userggSlug}) => {
    const defaultProfilePath = 'http://localhost:5000/users/' + id + '.png';
    const [profilePic, setProfilePic] = useState(undefined);
    const [profilePicPath, setProfilePicPath] = useState(undefined);
    const [ggSlug, setggSlug] = useState(undefined);

    const handlePicChange = (e) => {
        setProfilePic(e.target.files[0]);
        setProfilePicPath(URL.createObjectURL(e.target.files[0]));
    }

    const handleSlugChange = (e) => {
        setggSlug(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if((!ggSlug || ggSlug === userggSlug) && profilePic === undefined) return;
        const formData = new FormData();
        if(ggSlug && ggSlug !== userggSlug) formData.append('ggSlug', ggSlug);
        formData.append('profile-pic', profilePic);

        axios.post('http://localhost:5000/users/updateprofile', formData, {withCredentials : true})
            .then(res => {
                window.location.reload(); // Reload the page to update cached image
            })
            .catch(err => {
                console.log(err.response.data);
            })
    }

    return(
        <form className='container-fluid h-100 text-center updater-container' encType='multipart/form-data' onSubmit={handleSubmit}>
        <div className='row align-items-center h-100'>
        <div className='col'>

            <label htmlFor='profile-pic'>
                <input 
                    type="file" 
                    accept=".png, .jpg, .jpeg"
                    name='profile-pic'
                    id='profile-pic'
                    style={{display: 'none'}}
                    onChange={handlePicChange}
                />
                <CirclePicture src={id === undefined ? profilePicPath : defaultProfilePath} className='profile-pic shadow'/>
            </label>

            <div className='row nameandslug'>
            <div className='col profile-name bg-dark text-light shadow'>{name}</div>
            <input 
                className='col form-control text-center ggsluginput shadow'
                type="text"
                name="smashggslug"
                defaultValue={userggSlug}
                placeholder={'SmashGG ID'}
                onChange={handleSlugChange}
            />
            </div>
            
            <input 
                className='form-control savebutton rounded-pill'
                type="submit"
                value='Save'
            />
        </div>
        </div>
        </form>
    )
}

const ProfileUpdater = connect(mapStateToProps)(ConnectedProfileUpdater);
export default ProfileUpdater;