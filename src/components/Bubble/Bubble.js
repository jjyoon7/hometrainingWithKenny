import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../Context'
import './Bubble.css'

export default function Bubble() {
    const { isMobileScreen, kennysMessage } = useContext(Context)
    
    return (
        <div className={ isMobileScreen ? "bubble display-false" : "bubble-div bubble"}>
            <img className="bubble-img" src={'https://res.cloudinary.com/dvj9whqch/image/upload/v1600091895/bubble3_jvywne.svg'} />
            <h2 className="bubble-text">{kennysMessage}</h2>
        </div>
    )
}