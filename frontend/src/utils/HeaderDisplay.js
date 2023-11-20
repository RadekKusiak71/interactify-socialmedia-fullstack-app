import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

const HeaderDisplay = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default HeaderDisplay