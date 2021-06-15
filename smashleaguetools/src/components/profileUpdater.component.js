import {React, useState} from 'react';
import portrait from '../Final_Destination_Melee.png'

const ProfileUpdater = () => {
    const [profilePic, setProfilePic] = useState(portrait);

    const handlePicChange = (e) => {
        console.log(e.target.files[0]);
        setProfilePic(URL.createObjectURL(e.target.files[0]));
    }

    return(
        <form className='container-fluid h-100 text-center updater-container' encType='multipart/form-data'>
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
                <div className='profile-pic-outerborder shadow' style={{cursor: 'pointer'}}>
                <div className='profile-pic-container' style={{cursor: 'pointer'}}>
                    <img src={profilePic} className='profile-pic'/>
                </div>
                </div>
            </label>
            <div className='profile-name bg-dark text-light rounded-pill shadow'>Liar</div>

            <input 
                className='form-control text-center ggsluginput'
                type="text"
                name="smashggslug"
                defaultValue={'s5346vs'}
                placeholder={'SmashGG ID'}
            />

            <input 
                className='form-control savebutton'
                type="submit"
                value='Save'
            />

        </div>
        </div>
        </form>
    )
}

export default ProfileUpdater;