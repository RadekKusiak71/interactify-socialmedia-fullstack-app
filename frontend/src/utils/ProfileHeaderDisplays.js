import React from 'react'
import classes from '../components/Profile/Profile.module.css'
import Card from '../ui/Card'
import ProfileHeader from '../components/Profile/ProfileHeader'
import { NavLink, useParams, Outlet } from 'react-router-dom'

const ProfileHeaderDisplays = () => {
    let { username } = useParams();
    return (
        <Card>
            <ProfileHeader />
            <div className={classes['profile-post-buttons']}>
                <NavLink to={`/account/${username}/`} className={classes['menu-item']}>
                    {({ isActive }) => isActive ? (
                        <button className={classes['profile-btn-active']}>Profile Posts</button>
                    ) : (
                        <button className={classes['profile-btn']}>Profile Posts</button>
                    )}
                </NavLink>
                <NavLink to={`/account/${username}/shared/`} className={classes['menu-item']}>
                    {({ isActive }) => isActive ? (
                        <button className={classes['profile-btn-active']}>Shared</button>
                    ) : (
                        <button className={classes['profile-btn']}>Shared</button>
                    )}
                </NavLink>
                <NavLink to={`/account/${username}/saved/`} className={classes['menu-item']}>
                    {({ isActive }) => isActive ? (
                        <button className={classes['profile-btn-active']}>Saved</button>
                    ) : (
                        <button className={classes['profile-btn']}>Saved</button>
                    )}
                </NavLink>
            </div>
            <Outlet />
        </Card>
    )
}

export default ProfileHeaderDisplays

