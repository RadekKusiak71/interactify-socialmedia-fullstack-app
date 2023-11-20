import React, { createContext, useCallback, useState } from 'react'

const PostContext = createContext()

export default PostContext

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([])


    const fetchPosts = useCallback(async () => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/posts/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let data = await response.json()
            if (response.ok) {
                setPosts(data)
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }
    }, [setPosts])

    const postContextData = {
        fetchPosts: fetchPosts,
        posts: posts
    }

    return (
        <PostContext.Provider value={postContextData}>
            {children}
        </PostContext.Provider>
    )
}