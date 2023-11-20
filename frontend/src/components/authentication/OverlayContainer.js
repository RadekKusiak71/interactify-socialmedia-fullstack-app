import React from 'react';
import classes from './OverlayContainer.module.css';
import { motion } from 'framer-motion';

const OverlayContainer = (props) => {

    const animateContent = {
        hidden: { opacity: 0, x: '50%' },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 1,
                type: "spring",
                damping: 100,
                stiffness: 500,
                delay: 0.5
            },
        },
        exit: {
            x: '50%', opacity: 0, scale: 0.2
        },
    };
    const animateContent2 = {
        hidden: { opacity: 0, x: '-50%' },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 1,
                type: "spring",
                damping: 100,
                stiffness: 500,
                delay: 0.5
            },
        },
        exit: {
            x: '-50%', opacity: 0, scale: 0.2
        },
    };
    const animateButton = {
        hidden: { opacity: 0, x: '130%' },
        visible: {
            opacity: 1,
            x: ['130%', '0%'],
            transition: {
                type: "spring",
                damping: 100,
                stiffness: 500,
                duration: 0.5,
                delay: 0.5
            },
        },
        exit: {
            x: '30%', opacity: 0, scale: 0.2
        },
    };
    const animateButton2 = {
        hidden: { opacity: 0, x: '-130%' },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                damping: 100,
                stiffness: 500,
                duration: 0.5,
                delay: 0.5
            },
        },
        exit: {
            x: '-30%', opacity: 0, scale: 0.2
        },
    };

    return (
        <div className={`${classes['overlay-container']} ${props.signIn ? classes.left : classes.right}`}>
            <div className={classes['overlay-text']}>
                <motion.div
                    key={props.signIn ? 'signIn' : 'signUp'}
                    variants={props.signIn ? animateContent : animateContent2}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <h2>{props.signIn ? 'Hello, Friend!' : 'Welcome Back!'}</h2>
                    <p>
                        {props.signIn ? 'Enter your personal details and start the journey with us' : 'To keep connected with us, please login with your personal data'}
                    </p>
                </motion.div>
            </div>
            <motion.button
                key={props.signIn ? 'signIn' : 'signUp'}
                whileHover={{ backgroundColor: '#EEEEEE', color: '#222831', }}
                type="button"
                onClick={props.handleFormSwitch}
                className={classes['overlay-button']}
                variants={props.signIn ? animateButton : animateButton2}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {props.signIn ? <>SIGN IN</> : <>SIGN UP</>}
            </motion.button>
        </div>
    );
};

export default OverlayContainer;
