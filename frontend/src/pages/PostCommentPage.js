import React, { useCallback, useEffect, useState } from 'react'
import classes from './PostCommentPage.module.css'
import { useParams } from 'react-router-dom'
import Post from '../components/Post'
import CommentForm from '../components/CommentForm'
import Comment from '../components/Comment'
import interactifyLogo from '../assets/interactify-transparent-logo.png'
import returnIcon from '../assets/close.svg'
import { Link } from 'react-router-dom'

const PostCommentPage = () => {

    const { postID } = useParams()
    const [comments, setComments] = useState(null)
    const [postData, setPostData] = useState(null)

    const fetchPost = useCallback(async () => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/posts/${postID}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let data = await response.json()
            if (response.ok) {
                setPostData(data)
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }
    }, [setPostData, postID])

    const fetchComments = useCallback(async () => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/comments/post_comments/${postID}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let data = await response.json()
            if (response.ok) {
                setComments(data)
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }
    }, [setComments, postID])


    useEffect(() => {
        fetchPost()
        let waiter = setTimeout(() => fetchComments(), 500)
        return () => clearTimeout(waiter)


    }, [fetchPost, fetchComments])

    return (
        <>
            <div className={classes['commentpage-navigation']}>
                <Link to={'/'}><img src={interactifyLogo} alt='interactify logo' /></Link>
                <Link to={'/'}> <img src={returnIcon} alt='return icon' /></Link>
            </div>
            <div className={classes['post-comments-container']}>
                {postData &&
                    <Post
                        key={postData.id}
                        postID={postData.id}
                        likesCount={postData.likes_count}
                        commentsCount={postData.comments_count}
                        creatorName={postData.creator_name}
                        profileImagePost={postData.profile_image}
                        postBody={postData.body}
                        postAttachement={postData.attachment}
                        createdDate={postData.created_date}
                        likesArray={postData.likes} />
                }
                <CommentForm fetchComments={fetchComments} postID={postID} />
                {comments && comments.map(comment =>
                    <Comment
                        key={comment.id}
                        commentID={comment.id}
                        likesCount={comment.likes_count}
                        creatorName={comment.username}
                        profileImageComment={comment.profile_picture}
                        postBody={comment.body}
                        createdDate={comment.created_date}
                        likesArrayComment={comment.likes}
                    />)}
            </div>
        </>
    )
}

export default PostCommentPage