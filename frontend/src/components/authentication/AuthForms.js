import React, { useContext, useEffect, useState } from 'react';
import classes from './AuthForms.module.css';
import AuthContext from '../../context/AuthContext';
import { motion } from 'framer-motion'

const AuthForms = (props) => {
  const { userRegister, userLogin } = useContext(AuthContext);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
  });

  const registerInputsHandler = (e) => {
    setRegisterData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const loginInputsHandler = (e) => {
    setLoginData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitRegisterForm = (e) => {
    e.preventDefault();
    userRegister(registerData);
  };
  const submitLoginForm = (e) => {
    e.preventDefault();
    userLogin(loginData);
  };

  useEffect(() => {
    if (props.signIn) {
      setLoginData({
        username: '',
        password: '',
      });
    } else {
      setRegisterData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: '',
      });
    }
  }, [props.signIn]);

  const formAnimation = {
    hidden: { opacity: 0, x: '100%', scale: 0.4 },
    visible: { opacity: 1, x: '0%', scale: 1, transition: { duration: 0.7, ease: 'easeInOut' } },
    exit: { x: '100%', scale: 0.4 }
  };
  const formAnimation2 = {
    hidden: { opacity: 0, x: 0, scale: 0.4 },
    visible: { opacity: 1, x: '100%', scale: 1, transition: { duration: 0.7, ease: 'easeInOut' } },
    exit: { x: 0, scale: 0.4 }
  };

  return (
    <div className={`${classes['form-container']} ${props.signIn ? classes.register : classes.login}`}>
      {props.signIn ? (
        <motion.form variants={formAnimation2} initial="hidden" animate="visible" key={props.signIn ? 'signIn' : 'signUp'} onSubmit={submitRegisterForm} className={`${classes['form']}`}>
          <h1>Create an account</h1>
          <div className={classes['inputs-container']}>
            <input onChange={registerInputsHandler} type="text" placeholder="Username" name="username" value={registerData.username} />
            <input onChange={registerInputsHandler} type="text" placeholder="First name" name="first_name" value={registerData.first_name} />
            <input onChange={registerInputsHandler} type="text" placeholder="Last name" name="last_name" value={registerData.last_name} />
            <input onChange={registerInputsHandler} type="email" placeholder="Email" name="email" value={registerData.email} />
            <input onChange={registerInputsHandler} type="password" placeholder="Password" name="password" value={registerData.password} />
            <input onChange={registerInputsHandler} type="password" placeholder="Re-type password" name="password2" value={registerData.password2} />
          </div>
          <button className={classes['form-button']}>SIGN UP</button>
        </motion.form>
      ) : (
        <motion.form variants={formAnimation} initial='hidden' animate='visible' exit='exit' key={props.signIn ? 'signIn' : 'signUp'} onSubmit={submitLoginForm} className={`${classes['form']}`}>
          <h1>Sign in</h1>
          <div className={classes['inputs-container']}>
            <input onChange={loginInputsHandler} type="text" placeholder="Username" name="username" value={loginData.username} />
            <input onChange={loginInputsHandler} type="password" placeholder="Password" name="password" value={loginData.password} />
          </div>
          <button className={classes['form-button']}>SIGN IN</button>
        </motion.form>
      )}
    </div>
  );
};

export default AuthForms;
