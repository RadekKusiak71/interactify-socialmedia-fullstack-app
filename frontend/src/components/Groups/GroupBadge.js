import React from 'react'
import classes from './GroupBadge.module.css'
import groupsIcon from '../../assets/groups.svg'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const GroupBadge = (props) => {
    const animationDirection = props.animateNum % 2 === 0 ? 'fromLeft' : 'fromRight';

    const variants = {
        fromLeft: {
            initial: { opacity: 1, x: -500 },
            animate: { opacity: 1, x: 0 },
        },
        fromRight: {
            initial: { opacity: 1, x: 500 },
            animate: { opacity: 1, x: 0 },
        },
    };

    return (
        <motion.div
            variants={variants[animationDirection]}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.02, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px' }}
            className={classes['group-badge']}>
            <Link to={`/group/${props.groupName}`}>
                <div className={classes['group-data']}>
                    <div className={classes['group-image']}>
                        {props.groupImage ? (
                            <img src={`http://127.0.0.1:8000/${props.groupImage}`} alt='Groups Icon' />
                        ) : (
                            <img src={groupsIcon} alt='Groups Icon' />
                        )}
                    </div>
                    <div className={classes['group-info']}>
                        <h2>{props.groupName}</h2>
                        <p>Created by: {props.creator}</p>
                        <p>Group age: {props.createdDate}</p>
                        <p>Members: {props.membersCounter}</p>
                    </div>
                </div>
                <div className={classes['group-description']}>
                    <p>{props.description}</p>
                </div>
            </Link>
        </motion.div >
    )
}

export default GroupBadge