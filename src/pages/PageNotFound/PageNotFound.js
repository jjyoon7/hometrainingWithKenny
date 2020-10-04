import React, { useContext } from 'react'
import { Context } from '../../Context'
import './PageNotFound.css'

export default function PageNotFound() {
    const { isMobileScreen } = useContext(Context)
    return (
        <>
            <div className={ isMobileScreen ? "div manual blue-round-shadow-effect-div shadow-blue-blur" : "div center-column blue-round-shadow-effect-div shadow-blue-blur"}></div>
            <div className={ isMobileScreen ? "page-not-found-div manual shadow-blue-solid outline" : "page-not-found-div center-column shadow-blue-solid outline"}>
                <div className="page-error-title"><h2>404: Oops, something went wrong.</h2></div>
            </div>
        </>
    )
}