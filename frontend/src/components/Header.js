import React, { useContext } from 'react'
import classes from './Header.module.css'
import { Link, NavLink } from 'react-router-dom'
import interactifyLogo from '../assets/interactify-transparent-logo.png'
import accountIcon from '../assets/account.svg'
import homeIcon from '../assets/home.svg'
import groupsIcon from '../assets/groups.svg'
import logoutIcon from '../assets/logout.svg'
import accountBlueIcon from '../assets/accountBlue.svg'
import homeBlueIcon from '../assets/homeBlue.svg'
import groupsBlueIcon from '../assets/groupsBlue.svg'
import logoutBlueIcon from '../assets/logoutBlue.svg'
import AuthContext from '../context/AuthContext'

const Header = () => {
    const { userLogout, user } = useContext(AuthContext);

    return (
        <>
            <header>
                <div className={classes['header-logo']}>
                    <Link to='/'>
                        <img src={interactifyLogo} alt='interactify' />
                    </Link>
                </div>
                <nav className={classes['header-menu']}>
                    <NavLink to='/' className={classes['menu-item']}>
                        {({ isActive }) => isActive ? (
                            <img src={homeBlueIcon} alt='Home' className={classes['icon']} />
                        ) : (
                            <img src={homeIcon} alt='Home' className={classes['icon']} />
                        )}
                    </NavLink>
                    <NavLink to='/groups' className={classes['menu-item']}>
                        {({ isActive }) => isActive ? (
                            <img src={groupsBlueIcon} alt='Groups' className={classes['icon']} />
                        ) : (
                            <img src={groupsIcon} alt='Groups' className={classes['icon']} />
                        )}
                    </NavLink>
                    <NavLink to={`/account/${user.name}`} className={classes['menu-item']}>
                        {({ isActive }) => isActive ? (
                            <img src={accountBlueIcon} alt='Account' className={classes['icon']} />
                        ) : (
                            <img src={accountIcon} alt='Account' className={classes['icon']} />
                        )}
                    </NavLink>
                    <NavLink to='/auth' onClick={() => userLogout()} className={classes['menu-item']}>
                        {({ isActive }) => isActive ? (
                            <img src={logoutBlueIcon} alt='Groups' className={classes['icon']} />
                        ) : (
                            <img src={logoutIcon} alt='Groups' className={classes['icon']} />
                        )}
                    </NavLink>
                </nav>
            </header>
        </>
    );
}

export default Header;