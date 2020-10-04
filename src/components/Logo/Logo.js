import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Logo() {
    const history = useHistory()
    
    const onClickLogo = () => {
        history.push('/')
    }

    return (
        <div className="logo-div logo" onClick={onClickLogo}>
            <h1 className="logo-title title">Hometraining with Kenny</h1>
        </div>
    )
}