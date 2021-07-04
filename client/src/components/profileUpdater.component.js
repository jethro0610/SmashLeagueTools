import {React, useState} from 'react';
import store from '../redux/store/store'
import { addNotification } from '../redux/reducers/notifications';
import axios from 'axios';
import CirclePicture from './circlePicture.component';
import './css/profileUpdater.css'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { textColor, pureThemeColor, inputBorderColor } from '../themeStyles';

const SlugInput = styled.input`
  background-color: ${pureThemeColor};
  border: 1px solid ${inputBorderColor};
  color: ${textColor};
`

const mapStateToProps = state => {
    return { 
        name: state.userInfo.name,
        id: state.userInfo.id,
        userggSlug: state.userInfo.ggSlug
    }
}

const ConnectedProfileUpdater = ({name, id, userggSlug}) => {
    const defaultProfilePath = id === undefined ? undefined : process.env.REACT_APP_BACKEND_ORIGIN + '/users/' + id + '/picture';
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

        axios.post(process.env.REACT_APP_BACKEND_ORIGIN + '/users/updateprofile', formData, {withCredentials : true})
            .then(res => {
                window.location.reload(); // Reload the page to update cached image
            })
            .catch(err => {
                store.dispatch(addNotification(err.response.data));
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
                <CirclePicture 
                src={profilePicPath === undefined ? defaultProfilePath : profilePicPath} 
                className='profile-pic shadow' 
                style={{cursor: 'pointer'}}/>
            </label>

            <div className='row nameandslug'>
            <div className='col profile-name bg-dark text-light shadow'>{name}</div>
            <SlugInput 
                className='col text-center ggsluginput shadow'
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