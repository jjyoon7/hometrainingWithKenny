import React, { useContext } from 'react'
import { Context } from '../../Context'
import './Manual.css'

export default function Manual() {
    const { isMobileScreen } = useContext(Context)
    const manualStyle = isMobileScreen ? 'z-index-back-layer' : '' 
    return (
        <>
            <div className={`manual blue-round-shadow-effect-div shadow-blue-blur ${manualStyle}`}></div>
            <div className={`manual manual-div shadow-blue-solid primary-blue-text outline ${manualStyle}`}>
                <h2 className="manual-title">How it works</h2>
                <h3 className="manual-number-1">①</h3> <h3 className="manual-text-1">Set a weekly exercise goal</h3>
                <h3 className="manual-number-2">②</h3> <h3 className="manual-text-2">Chose a body section and duration</h3>
                <h3 className="manual-number-3">③</h3> <h3 className="manual-text-3">Kenny will fetch you an exercise!</h3>
                <h3 className="manual-number-4">④</h3> <h3 className="manual-text-4">Click <i className="ri-todo-line"></i> to update your weekly goal.</h3>
            </div>
        </>
    )
}