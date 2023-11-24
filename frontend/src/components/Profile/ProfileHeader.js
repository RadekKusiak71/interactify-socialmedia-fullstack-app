import React, { useCallback, useContext, useEffect, useState } from 'react'
import classes from './ProfileHeader.module.css'
import profileIcon from '../../assets/profile.svg'
import { useParams } from 'react-router-dom'
import timeAgo from '../../utils/timeAgo'
import AuthContext from '../../context/AuthContext'

const ProfileHeader = () => {
    const { username } = useParams()
    const { user } = useContext(AuthContext)
    const [userData, setUserData] = useState([])
    const [followed, setFollwed] = useState(false)


    const fetchProfileData = useCallback(async () => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/profiles/username/${username}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            let data = await response.json()
            if (response.ok) {
                setUserData(data)
                if (data.followers.includes(user.profile_id)) {
                    setFollwed(true)
                }
            } else {
                setFollwed(false)
            }
        } catch (err) {
            console.log(err)
        }
    }, [setUserData, user.profile_id, username])

    const followProfile = async () => {
        setFollwed(!followed)
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/profiles/profile/${username}/follow/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'user_id': user.user_id })
            })
            let data = await response.json()
            if (response.ok) {
                fetchProfileData()
            } else {
                setFollwed(!followed)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchProfileData()
    }, [fetchProfileData])

    return (
        <div className={classes['profile-headers']}>
            <div className={classes['profile-image']}>
                {userData.profile_image ? (
                    <img src={`http://127.0.0.1:8000${userData.profile_image}/`} alt='profile' />
                ) : (
                    <img src={profileIcon} alt='profile icon' />
                )}
            </div>
            <div className={classes['profile-description']}>
                <h2>{userData.first_name} {userData.last_name}</h2>
                <p>@{username}</p>
                <p>Profile created - {timeAgo(userData.created_at)}</p>
                <p>{userData.followers_count} Followers</p>
                <p>{userData.followed_count} Following</p>
            </div>
            <div className={classes['profile-buttons']}>
                {userData.username = user.username ? (
                    <>
                        <button type='button' className={classes['profile-buttons-unactive']} disabled>Follow</button>
                        <button type='button' className={classes['profile-buttons-unactive']} disabled>Message</button>
                    </>
                ) : (
                    <>
                        {followed ? (
                            <>
                                <button onClick={() => followProfile()} type='button' className={classes['profile-buttons-active']}>Followed</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => followProfile()} type='button' className={classes['profile-buttons-unactive']}>Follow</button>
                            </>
                        )}
                        <button type='button' className={classes['profile-buttons-unactive']}>Message</button>
                    </>
                )
                }
            </div >
        </div >
    )
}

export default ProfileHeader