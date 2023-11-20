import React, { useCallback, useContext, useEffect, useState } from 'react'
import classes from './Post.module.css'
import shareIcon from '../assets/share.svg'
import bookmarkIcon from '../assets/bookmark.svg'
import profileIcon from '../assets/profile.svg'
import heartIcon from '../assets/heart.svg'
import heartBlueIcon from '../assets/heart_blue.svg'
import commentsIcon from '../assets/comments.svg'
import shareBlueIcon from '../assets/shareBlue.svg'
import bookmarkBlueIcon from '../assets/bookmarkBlue.svg'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import timeAgo from '../utils/timeAgo'


const Post = (props) => {
    const { user } = useContext(AuthContext)
    const [isShared, setIsShared] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(props.likesArray.includes(user.user_id));
    const [likeCounter, setLikeCounter] = useState(props.likesCount)
    const location = useLocation();
    const isCommentPage = location.pathname.includes('comments');

    const fetchPostShareSavedStatus = useCallback(
        async () => {
            try {
                let response = await fetch(`http://127.0.0.1:8000/api/posts/profile_posts/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 'user_id': user.user_id })
                })
                let data = await response.json()
                if (response.ok) {
                    setIsSaved(data.saved_posts.map(post => post.id).includes(props.postID));
                    setIsShared(data.shared_posts.map(post => post.id).includes(props.postID));
                } else {
                    console.log(data);
                }
            } catch (err) {
                console.log(err);
            }
        }, [user.user_id, setIsShared, setIsSaved, props.postID]
    );

    const changePostReaction = async () => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/posts/post_reaction/${props.postID}/`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'user_id': user.user_id })
            })
            let data = await response.json()
            if (response.ok) {
                setLikeCounter(data.likes_count)
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }

    }

    const changePostShareStatus = async () => {
        setIsShared(!isShared)
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/posts/post_share/${props.postID}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'user_id': user.user_id })
            })
            let data = await response.json()
            if (response.ok) {
                fetchPostShareSavedStatus();
            } else {
                console.log(data);
            }
        } catch (err) {
            console.log(err);
        }
    }
    const changePostSaveStatus = async () => {
        setIsSaved(!isSaved)
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/posts/post_bookmark/${props.postID}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'user_id': user.user_id })
            })
            let data = await response.json()
            if (response.ok) {
                fetchPostShareSavedStatus();
            } else {
                console.log(data);
            }
        } catch (err) {
            console.log(err);
        }
    }
    const handlePostReaction = () => {
        changePostReaction()
        setIsLiked(!isLiked)
    }

    useEffect(() => {
        fetchPostShareSavedStatus()
    }, [fetchPostShareSavedStatus])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={classes['post-container']}>
            <div className={classes['post-data']}>
                <div className={classes['post-profile-image']}>
                    {props.profileImagePost ? (
                        <Link to={`/account/${props.creatorName}`}>
                            <img src={`http://127.0.0.1:8000/media/${props.profileImagePost}`} alt='profile-icon' />
                        </Link>
                    ) : (
                        <Link to={`/account/${props.creatorName}`}>
                            <img src={profileIcon} alt='profile-icon' />
                        </Link>
                    )}
                </div>
                <div className={classes['post-user-data']}>
                    <Link to={`/account/${props.creatorName}`}>
                        <p>{props.creatorName}</p>
                    </Link>
                    <p>{timeAgo(props.createdDate)}</p>
                </div>
                <div className={classes['post-data-options']}>
                    {isSaved ? (
                        <motion.img key={isSaved} animate={{ scale: ['60%', '120%', '100%'] }} onClick={changePostSaveStatus} src={bookmarkBlueIcon} alt='bookark-icon' />
                    ) : (
                        <motion.img animate={{ scale: ['60%', '120%', '100%'] }} onClick={changePostSaveStatus} src={bookmarkIcon} alt='bookark-icon' />
                    )}
                    {isShared ? (
                        <motion.img animate={{ scale: ['60%', '120%', '100%'] }} onClick={changePostShareStatus} src={shareBlueIcon} alt='share-icon' />
                    ) : (
                        <motion.img key={isShared} animate={{ scale: ['60%', '120%', '100%'] }} onClick={changePostShareStatus} src={shareIcon} alt='share-icon' />
                    )}
                </div>
            </div>

            <div className={classes['post-body']}>
                <div className={classes['post-body-description']}>
                    <p>{props.postBody}</p>
                </div>
                <div className={classes['post-attachement']}>
                    {props.postAttachement && (
                        <img src={`http://127.0.0.1:8000${props.postAttachement}`} className={classes['attachment-image']} alt='dasda' />
                    )}
                </div>
            </div>

            {!isCommentPage && (
                <div className={classes['post-comment-form']}>
                    {user.profile_img ? (
                        <Link to={`/account/${user.name}`}>
                            <img src={`http://127.0.0.1:8000/${user.profile_img}`} alt='profile-icon' />
                        </Link>
                    ) : (
                        <Link to={`/account/${user.name}`}>
                            <img src={profileIcon} alt='profile-icon' />
                        </Link>
                    )}
                    <Link to={`/${props.postID}/comments`} className={classes['post-comment-link']}>
                        <button className={classes['post-comment-input']}>Write Something</button>
                    </Link>
                </div>
            )}

            <div className={classes['post-reactions']}>
                <div className={classes['post-reactions-icons']}>
                    {isLiked ? (
                        <motion.img key={isLiked} animate={{ scale: ['60%', '120%', '100%'] }} onClick={handlePostReaction} src={heartBlueIcon} alt='post reactions' />

                    ) : (

                        <motion.img key={isLiked} animate={{ scale: ['60%', '120%', '100%'] }} onClick={handlePostReaction} src={heartIcon} alt='post reactions' />
                    )}
                    <img src={commentsIcon} alt='post reactions' />
                </div>
                <div className={classes['post-reactions-counters']}>
                    <p>{likeCounter} likes</p>
                    <p><Link to={`/${props.postID}/comments`}>{props.commentsCount} Comments</Link></p>
                </div>
            </div>

            <hr />
        </motion.div >
    )
}

export default Post