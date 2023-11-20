import React, { useContext, useEffect, useState } from 'react'
import Card from '../ui/Card'
import PostForm from '../components/Home/PostForm'
import classes from './HomePage.module.css'
import profilePicture from '../assets/profile.svg'
import SearchForm from '../components/Home/SearchForm'
import { motion } from 'framer-motion'
import Post from '../components/Post'
import PostContext from '../context/PostContext'
import AuthContext from '../context/AuthContext'


const HomePage = () => {

  let { user } = useContext(AuthContext)
  const [openForm, setOpenForm] = useState(false)
  const { fetchPosts, posts } = useContext(PostContext)

  const openFormHandler = () => {
    setOpenForm(!openForm)
  }

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])


  return (
    <Card>
      <div className={classes['main-home']}>
        <SearchForm />
        <motion.div initial={{ scale: 0.2 }}
          animate={{ scale: 1, transition: { duration: 0.3, ease: 'easeInOut' } }}
          className={classes['home-form-opener']}>
          {user.profile_img ? (
            <img src={`http://127.0.0.1:8000${user.profile_img}`} alt='profile' />
          ) : (
            <img src={profilePicture} alt='profile' />
          )}
          <button onClick={openFormHandler} className={classes['home-form-button']}>Click Here to Write Something!</button>
        </motion.div>
        {openForm &&
          <PostForm openFormHandler={openFormHandler} />
        }
      </div>
      {posts ? (
        posts.map((post) => (
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
            likesArray={post.likes}
          />
        ))

      ) : (
        <p>Loading...</p>
      )}
    </Card>
  )
}

export default HomePage