import React, { useState } from 'react'
import AuthForms from '../components/authentication/AuthForms'
import OverlayContainer from '../components/authentication/OverlayContainer'
import classes from './AuthPage.module.css'

const AuthPage = () => {
  const [signIn, setSignIn] = useState(false)

  const handleFormSwitch = () => {
    setSignIn(!signIn)
  }

  return (
    <div className={classes['auth-wrapper']}>
      <div className={classes['auth-container']}>
        <AuthForms signIn={signIn} />
        <OverlayContainer handleFormSwitch={handleFormSwitch} signIn={signIn} />
      </div>
    </div>
  )
}

export default AuthPage