import {React} from 'react';
import { Link } from "react-router-dom";
import CirclePicture from './circlePicture.component';

import { connect } from 'react-redux';
const mapStateToProps = state => {
    return { 
        id: state.userInfo.id,
        balance: state.userInfo.balance
    }
}

const ConnectedNavbarProfile = ({id, balance}) => {
    // Return a login button if the users isn't logged in
    if (id ===  undefined)
        return (
            <div className='navbar-nav'><a className='nav-link' href={process.env.REACT_APP_BACKEND_ORIGIN+'/auth'}>Login</a></div>
        )
    
    // Return the profile picture and balance if the user is logged in
    const profilePicPath = process.env.REACT_APP_BACKEND_ORIGIN + '/users/' + id + '/picture'; // Get the users profile picture
    return(
        <div className='navbar-nav ms-auto text-light d-flex flex-row align-items-center'>
            <div className='navbar-balance text-dark bg-light rounded-pill'>Balance: ${balance}</div>
            <Link to='/profile'>
                <CirclePicture className='navbar-profile-pic shadow-sm' src={profilePicPath}/>
            </Link>
        </div>
    )
}

const NavbarProfile = connect(mapStateToProps)(ConnectedNavbarProfile);
export default NavbarProfile;
