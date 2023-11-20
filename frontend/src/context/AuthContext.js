import React, { createContext, useCallback, useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    const [registerError, setRegisterError] = useState(null)
    const [loginError, setLoginError] = useState(null)
    const navigate = useNavigate()

    const userRegister = async (formData) => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            let data = await response.json()

            if (response.ok) {
                console.log(data)
                const logData = {
                    username: formData.username,
                    password: formData.password
                }
                userLogin(logData)
            } else {
                console.log(data)
                setRegisterError(data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const userLogin = async (formData) => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            let data = await response.json()
            if (response.ok) {
                setAuthTokens(data)
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data))
                navigate('/')
            } else {
                setLoginError(data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const userLogout = useCallback(() => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/auth')
    }, [setAuthTokens, setUser, navigate])

    useEffect(() => {

        const updateToken = async () => {
            try {
                let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 'refresh': authTokens.refresh })
                });
                let data = await response.json();

                if (response.ok) {
                    setAuthTokens(data);
                    setUser(jwtDecode(data.access));
                    localStorage.setItem('authTokens', JSON.stringify(data));
                    return true
                } else {
                    return false
                }
            } catch (err) {
                return false
            }
        }

        const refresher = 1000 * 60 * 14
        const interval = setInterval(() => {
            if (authTokens) {
                console.log('updating tokens...')
                if (!updateToken()) {
                    userLogout()
                }
            }
        }, refresher)

        return () => clearInterval(interval)
    }, [authTokens, userLogout]);

    const authContextData = {
        user: user,
        setUser: setUser,
        registerError: registerError,
        loginError: loginError,
        userRegister: userRegister,
        userLogin: userLogin,
        userLogout: userLogout
    }

    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    )
}