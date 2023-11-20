import React, { useContext, useState } from 'react'
import classes from './Comment.module.css'
import profileIcon from '../assets/profile.svg'
import { Link } from 'react-router-dom'
import heartIcon from '../assets/heart.svg'
import heartBlueIcon from '../assets/heart_blue.svg'
import { motion } from 'framer-motion'
import AuthContext from '../context/AuthContext'
import timeAgo from '../utils/timeAgo'

const Comment = (props) => {
    const { user } = useContext(AuthContext)
    const [isLikedComment, setIsLikedComment] = useState(props.likesArrayComment.includes(user.user_id));
    const [likeCounter, setLikeCounter] = useState(props.likesCount)

    const reactionHandler = async () => {
        setIsLikedComment(!isLikedComment)
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/comments/comment_reaction/${props.commentID}/`, {

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



    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className={classes['comment-container']}>
                <div className={classes['comment-data']}>

                    <div className={classes['profile-comment-image']}>
                        {props.profileImageComment ? (
                            <Link to={`/account/${props.creatorName}`}>
                                <img src={`http://127.0.0.1:8000/media/${props.profileImageComment}/`} alt='profile icon' />
                            </Link>

                        ) : (
                            <Link>
                                <img src={profileIcon} alt='profile icon' />
                            </Link>
                        )}
                    </div>
                    <div className={classes['username-comment-container']}>
                        <Link>{props.creatorName}</Link>
                    </div>
                    <div className={classes['date-comment-container']}>
                        <p>{timeAgo(props.createdDate)}</p>
                    </div>
                </div>
                <div className={classes['comment-body']}>
                    <p>{props.postBody}</p>
                </div>
                <div className={classes['post-reactions']}>
                    <div className={classes['post-reactions-icons']}>
                        {isLikedComment ? (
                            <motion.img onClick={reactionHandler} key={1} animate={{ scale: ['60%', '120%', '100%'] }} src={heartBlueIcon} alt='post reactions' />
                        ) : (
                            <motion.img onClick={reactionHandler} animate={{ scale: ['60%', '120%', '100%'] }} src={heartIcon} alt='post reactions' />
                        )}
                    </div>
                    <div className={classes['post-reactions-counters']}>
                        <p>{likeCounter} likes</p>
                    </div>
                </div>
            </motion.div >
        </>
    )
}

export default Comment