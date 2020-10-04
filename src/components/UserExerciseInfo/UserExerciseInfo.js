import React, { useEffect, useContext } from 'react'
import { Context } from '../../Context'

import './UserExerciseInfo.css'

export default function UserExerciseInfo() {
    const { isAuth, 
            totalWorkoutTime, 
            upperTotalWorkoutTime, 
            coreTotalWorkoutTime, 
            lowerTotalWorkoutTime, 
            setIsInUserExerciseProfilePage } = useContext(Context)

    useEffect(() => {
        setIsInUserExerciseProfilePage(true)
        // console.log('exercise profile')
    }, [ isAuth ])

    return(
        <>
            <div className="manual blue-round-shadow-effect-div shadow-blue-blur"></div>
            <div className="manual user-exercise-info-div shadow-blue-solid primary-blue-text outline">
                <h1 className="exercise-duration-head-title">Workout time</h1>
                <h2 className="font-size-update exercise-duration-title-1">Total</h2> <h2 className="exercise-duration-middle-bar-1"> : </h2> <h2 className="exercise-duration-minuate-1">{totalWorkoutTime} </h2><h2 className="exercise-duration-minuate-indicator-1">min.</h2>
                <h2 className="font-size-update exercise-duration-title-2">Upper</h2> <h2 className="exercise-duration-middle-bar-2"> : </h2> <h2 className="exercise-duration-minuate-2">{upperTotalWorkoutTime} </h2><h2 className="exercise-duration-minuate-indicator-2">min.</h2>
                <h2 className="font-size-update exercise-duration-title-3">Core</h2> <h2 className="exercise-duration-middle-bar-3"> : </h2> <h2 className="exercise-duration-minuate-3">{coreTotalWorkoutTime} </h2><h2 className="exercise-duration-minuate-indicator-3">min.</h2>
                <h2 className="font-size-update exercise-duration-title-4">Lower</h2> <h2 className="exercise-duration-middle-bar-4"> : </h2> <h2 className="exercise-duration-minuate-4">{lowerTotalWorkoutTime} </h2> <h2 className="exercise-duration-minuate-indicator-4">min.</h2>
            </div>    
        </>
    )
}