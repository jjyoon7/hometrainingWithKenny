import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'
import './KennyVisual.css'


export default function KennyVisual() {
    const kennyDesktopFace = 'https://res.cloudinary.com/dvj9whqch/image/upload/v1601061469/exfecthApp/kenny_body.svg'
    const kennyDesktopClosedEyes = 'https://res.cloudinary.com/dvj9whqch/image/upload/v1601061429/exfecthApp/kenny_eyes_closed.svg'
    const kennyDesktopOpendEyes = 'https://res.cloudinary.com/dvj9whqch/image/upload/v1601061435/exfecthApp/kenny_eyes_opened.svg'

    const kennyMobileFace = 'https://res.cloudinary.com/dvj9whqch/image/upload/v1601223490/exfecthApp/kennyMobile_face.svg'
    const kennyMobileClosedEyes = 'https://res.cloudinary.com/dvj9whqch/image/upload/v1601223490/exfecthApp/kennyMobile_close_eyes.svg'
    const kennyMobileOpendEyes = 'https://res.cloudinary.com/dvj9whqch/image/upload/v1601223490/exfecthApp/kennyMobile_open_eyes.svg'

    const [ kennyBase, setKennyBase] = useState(kennyDesktopFace)
    const [ kennyClosedEyes, setKennyClosedEyes ] = useState(kennyDesktopClosedEyes)
    const [ kennyOpenedEyes, setKennyOpenedEyes ] = useState(kennyDesktopOpendEyes)

    const [ cssStyleKenny, setCssStyleKenny ] = useState('kenny')
    const { isMobileScreen } = useContext(Context)

    useEffect(() => {
        if(isMobileScreen) {
            setKennyBase(kennyMobileFace)
            setKennyClosedEyes(kennyMobileClosedEyes)
            setKennyOpenedEyes(kennyMobileOpendEyes)
            setCssStyleKenny('kenny-mobile')
        } else {
            setKennyBase(kennyDesktopFace)
            setKennyClosedEyes(kennyDesktopClosedEyes)
            setKennyOpenedEyes(kennyDesktopOpendEyes)
            setCssStyleKenny('kenny')
        }
    }, [ isMobileScreen ])

    return (
        <>
            <div className={`kenny-visual-div ${cssStyleKenny}`}>
                <img className="kenny-visual-img base" src={kennyBase}/>
            </div>
            <div className={`kenny-visual-div ${cssStyleKenny}`}>
                <img className="kenny-visual-img closed-eyes" src={kennyClosedEyes}/>
            </div>
            <div className={`kenny-visual-div ${cssStyleKenny}`}>
                <img className="kenny-visual-img opened-eyes" src={kennyOpenedEyes}/>
            </div>           
        </>
    )
}