import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../../Context'

import './NavBar.css'

export default function NavBar() {
    const { isAuth, userId, isMobileScreen, logoutHandler } = useContext(Context)

    const authNav = <div className="nav-bar-div nav-bar">
                        <h2 className="nav-bar-icon">☰</h2>
                        <div className="nav-bar-items-div">
                            <Link to="/" className="nav-bar-link">Home</Link>
                            <Link to={`/user/${userId}`}>Profile</Link>
                            <a onClick={logoutHandler}>Log out</a>
                        </div>
                    </div>

    const unAuthNav = <div className="nav-bar-div nav-bar">
                        <h2 className="nav-bar-icon">☰</h2>
                        <div className="nav-bar-items-div">
                            <Link to="/" >Home</Link>  
                            { isMobileScreen ? 
                                <>
                                    <Link to="/login">Log in</Link>
                                    <Link to="/signup">Sign up</Link>
                                </>
                            :
                            null }  
                        </div> 
                      </div>

    return (
        <>
            { isAuth ? authNav : unAuthNav }
        </>
    )
}