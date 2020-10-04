import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../Context'
import ExerciseElement from '../ExerciseElement/ExerciseElement'

import './TopThreeExercises.css'

export default function TopThreeExercises() {
    const { topThreeExercisesArr, 
            isInUserExerciseProfilePage, 
            setIsIndividualExercisePage, 
            finishedExerciseRound, 
            isMobileScreen } = useContext(Context)

    const [ topThreeElements, setTopThreeElements ] = useState('')
    const [ displayTopThreeExerciseDiv, setDisplayTopThreeExerciseDiv ] = useState('')
    const [ userMessage, setUserMessage ] = useState('')
    const [ gridStyle, setGridStyle ] = useState('')
    const hasExerciseWithTotalRep = topThreeExercisesArr.length > 0
    
    //css for li is only different for 'Exercise' component
    //where user is on individual exercise page.
    //thus need to set it to false
    useEffect(() => {
        setIsIndividualExercisePage(false)
    }, [])

    useEffect(() => {
        if(isMobileScreen) {
            setGridStyle('exercise-form')
        } else {
            setGridStyle('center-column')
        }
    }, [ isMobileScreen ])

    useEffect(() => {
        if(hasExerciseWithTotalRep) {
            setUserMessage('')
        } else {
            setUserMessage('nothing yet :)')
        }
    }, [ topThreeExercisesArr, finishedExerciseRound ])

                                    
    useEffect(() => {
        const topThree = topThreeExercisesArr.map(exercise => {
            // console.log('exercise in top three', exercise)
            return <ExerciseElement key={exercise._id} 
            id={exercise._id} 
            bodySection={exercise.bodySection}
            duration={exercise.duration}
            title={exercise.title} 
            videoUrl={exercise.videoUrl}
            totalRep={exercise.totalRep} 
            favorite={exercise.favorite}/>
        })
        setTopThreeElements(topThree)
    }, [ topThreeExercisesArr, finishedExerciseRound ])

    useEffect(() => {
        if(isInUserExerciseProfilePage) {
            setDisplayTopThreeExerciseDiv('')
        } else {
            setDisplayTopThreeExerciseDiv('display-false')
        }
    }, [ isInUserExerciseProfilePage ])

    return (
        <>
            <div className={`${gridStyle} blue-round-shadow-effect-div shadow-blue-blur ${displayTopThreeExerciseDiv}`}></div>
            <div className={`${gridStyle} top-three-exercises-div shadow-blue-solid outline ${displayTopThreeExerciseDiv}`}>
                <h2 className="top-three-exercise-title">
                    Most repeated exercise{ topThreeExercisesArr.length > 1 ? 's' : ''}<i className="ri-award-fill"></i>
                </h2>
                <div className="top-three-content-div">
                    { hasExerciseWithTotalRep ? <ul className="top-three-exercises-ul">
                        {topThreeElements}
                    </ul> : <h3 className="error-message">{userMessage}</h3> }
                </div>
            </div>    
        </>
    )
}