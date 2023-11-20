import React, { useContext, useState } from 'react'
import closeIcon from '../../assets/close.svg'
import classes from './PostForm.module.css'
import { motion } from 'framer-motion'
import AuthContext from '../../context/AuthContext'

const dropIn = {
    hidden: {
        scale: 0.2,
        opacity: 0
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.5,
            type: "spring",
            damping: 100,
            stiffness: 500,
        },
    },
    exit: {
        scale: 0.2,
        opacity: 0,
    }
}

const PostForm = (props) => {
    const [file, setFile] = useState()
    const [body, setBody] = useState('')
    const { user } = useContext(AuthContext)

    const handleBackdropClose = (e) => {
        if (e.target === e.currentTarget) {
            props.openFormHandler();
        }
    }

    const handleBodyChange = (e) => {
        setBody(e.target.value)
    }
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handlePostFormSubmit = (e) => {
        e.preventDefault()
        sendFormData()
    }

    const sendFormData = async () => {
        const formData = new FormData()
        if (file) {
            formData.append("attachment", file)
        }
        formData.append('body', body)
        formData.append('user_id', user.user_id)

        try {
            let response = await fetch('http://127.0.0.1:8000/api/posts/', {
                method: 'POST',
                body: formData
            })
            let data = await response.json()
            if (response.ok) {
                props.openFormHandler();
                window.location.reload()
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div onClick={handleBackdropClose} className={classes['post-form-backdrop']}>
            <motion.div variants={dropIn} initial="hidden" animate="visible" exit="exit" className={classes['post-form-container']}>
                <div className={classes['post-form-header']}>
                    <h2>Create Post</h2>
                    <button onClick={() => props.openFormHandler()} className={classes['cancel-button']}><img src={closeIcon} alt='dcascda' /></button>
                </div>
                <hr />
                <form onSubmit={handlePostFormSubmit} className={classes['post-form']} encType="multipart/form-data">
                    <textarea onChange={handleBodyChange} placeholder='What do you think about?' value={body} />
                    <div className={classes['post-form-attachement']} onDragOver={handleDragOver} onDrop={handleFileDrop}>
                        <label className={classes['post-form-file-upload']}>
                            <input onChange={handleFileChange} type="file" name="attachement_url" accept='.mp4,.mp4,.png,.jpeg,.jpg' />
                            {file ?
                                <div onClick={() => setFile(null)} className={classes['file']}>
                                    <p>{file.name}</p>
                                </div>
                                : <p style={{ cursor: 'pointer' }}>Drag & Drop or Click and add a File</p>}
                        </label>
                    </div>
                    <button type='submit' className={classes['post-form-button']}>Send</button>
                </form>
            </motion.div>
        </div >
    )
}

export default PostForm