import React, { useContext, useState } from 'react'
import classes from './CommentForm.module.css'
import { motion } from 'framer-motion'
import AuthContext from '../context/AuthContext'

const CommentForm = (props) => {

    const [body, setBody] = useState('')
    const { user } = useContext(AuthContext)

    const bodyInputHandler = (e) => {
        setBody(e.target.value)
    }

    const commentSendHandler = async () => {
        try {
            const data = {
                user_id: user.user_id,
                post_id: props.postID,
                body: body
            }
            let response = await fetch('http://127.0.0.1:8000/api/comments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            let responseData = await response.json()
            if (response.ok) {
                setBody('')
                window.location.reload()
            } else {
                console.log(responseData)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const commentFormHandler = (e) => {
        e.preventDefault()
        if (body.trim().length > 0) {
            commentSendHandler()
            props.fetchComments(props.postID)
        }
    }


    return (
        <motion.form onSubmit={commentFormHandler} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={classes['comment-form-container']}>
            <textarea placeholder='Write a comment' onChange={bodyInputHandler} value={body} />
            <button>Send</button>
        </motion.form>
    )
}

export default CommentForm