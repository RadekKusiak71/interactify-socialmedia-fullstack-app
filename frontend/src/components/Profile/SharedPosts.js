import React, { useCallback, useEffect, useState } from 'react'
import Post from '../Post'
import { useParams } from 'react-router-dom'

const SharedPosts = () => {
  const [posts, setPosts] = useState([])
  const { username } = useParams()

  const fetchUserPosts = useCallback(async () => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/profiles/shared/${username}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let data = await response.json()
      if (response.ok) {
        setPosts(data)
      } else {
        console.log(response)
      }
    } catch (err) {
      console.log(err)
    }
  }, [setPosts])

  useEffect(() => {
    fetchUserPosts()
  }, [fetchUserPosts])

  return (
    posts.map(post => (
      <Post
        key={post.id}
        postID={post.id}
        likesCount={post.likes_count}
        commentsCount={post.comments_count}
        creatorName={post.creator_name}
        profileImagePost={post.profile_image}
        postBody={post.body}
        postAttachement={post.attachment}
        createdDate={post.created_date}
        likesArray={post.likes} />
    ))
  )
}

export default SharedPosts