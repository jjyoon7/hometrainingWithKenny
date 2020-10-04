import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Context } from '../../Context'
import ExerciseElement from '../../components/ExerciseElement/ExerciseElement'

import './Exercise.css'

export default function Exercise() {
    const { token, 
            userId, 
            setIsIndividualExercisePage, 
            isIndividualExercisePage, 
            setFinishedExerciseRound, 
            setIsWeeklyExerciseGoalAchieved, 
            setNeedToUpdateExerciseArr, 
            isMobileScreen, 
            setTotalWorkoutTime, 
            setUpperTotalWorkoutTime, 
            setCoreTotalWorkoutTime, 
            setLowerTotalWorkoutTime } = useContext(Context)

    const [ mappedExerciseVideo, setMappedExerciseVideo ] = useState('')
    const [ displayExerciseDiv, setDisplayExerciseDiv ] = useState('')
    const [ displayGridStyle, setDisplayGridStyle ] = useState('')
    
    let { exerciseId } = useParams()

    // console.log('exerciseId', exerciseId)

    useEffect(() => {
        setIsIndividualExercisePage(true)
    }, [])

    useEffect(() => {
        if(isIndividualExercisePage) {
            setDisplayExerciseDiv('')
        } else {
            setDisplayExerciseDiv('display-false')
        }
    }, [ isIndividualExercisePage ])

    useEffect(() => {
        if(isMobileScreen) {
            setDisplayGridStyle('exercise-form')
        } else {
            setDisplayGridStyle('center-column')
        }
    }, [ isMobileScreen ])

    useEffect(() => {
        setNeedToUpdateExerciseArr(false)
        const graphqlQuery = {
            query: `
                query GetExercise($id: ID!) {
                    exercise(id: $id) {
                        __typename
                        ...on Exercise {
                                _id
                                bodySection
                                duration
                                videoUrl
                                title
                                totalRep
                                favorite
                        }
                        ...on ExerciseNotFound {
                            message
                        }
                        ...on FetchingFailed {
                            message
                        }
                    }
                }
            `,
            variables: {
                id: exerciseId
            }
        }
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphqlQuery)
        })
        .then(res => {
            return res.json()
        })
        .then(resData => {
            if(resData.data.exercise.__typename === 'Exercise') {
                const graphqlResponse = resData.data.exercise
                const exerciseElement = <ExerciseElement 
                                            key={graphqlResponse._id} 
                                            id={graphqlResponse._id}
                                            bodySection={graphqlResponse.bodySection}
                                            duration={graphqlResponse.duration}
                                            title={graphqlResponse.title} 
                                            videoUrl={graphqlResponse.videoUrl} 
                                            favorite={graphqlResponse.favorite}
                                        />
                
                setMappedExerciseVideo(exerciseElement)
            }
        })
    }, [ exerciseId, token ])
    
    const onClickUpdateExerciseDone = () => {
        const graphqlQuery = {
            query: `
                mutation UpdateExerciseTotalRepAndWeeklyExerciseGoal($id: ID!, $userId: String!) {
                    updateExerciseTotalRepAndWeeklyExerciseGoal(id: $id, userId: $userId) {
                        __typename
                        ...on ExerciseRepAndWeeklyGoal {
                            totalRep
                            finishedExerciseRound
                            weeklyExerciseGoal
                            isWeeklyExerciseGoalAchieved
                            totalWorkoutTime
                            upperTotalWorkoutTime
                            coreTotalWorkoutTime
                            lowerTotalWorkoutTime
                        }
                        ...on ExerciseNotFound {
                            message
                        }
                        ...on FetchingFailed {
                            message
                        }
                    }
                }
            `,
            variables: {
                id: exerciseId,
                userId
            }
        }
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphqlQuery)
        })
        .then(res => {
            return res.json()
        })
        .then(resData => {
            const graphqlResponse = resData.data.updateExerciseTotalRepAndWeeklyExerciseGoal
            if(graphqlResponse.__typename === 'ExerciseRepAndWeeklyGoal') {
                setFinishedExerciseRound(graphqlResponse.finishedExerciseRound)
                setIsWeeklyExerciseGoalAchieved(graphqlResponse.isWeeklyExerciseGoalAchieved)
                
                setTotalWorkoutTime(graphqlResponse.totalWorkoutTime)
                setUpperTotalWorkoutTime(graphqlResponse.upperTotalWorkoutTime)
                setCoreTotalWorkoutTime(graphqlResponse.coreTotalWorkoutTime)
                setLowerTotalWorkoutTime(graphqlResponse.lowerTotalWorkoutTime)
            }
        })
        .catch(err => console.log(err))
    }

    return(
        <>
            <div className={`${displayGridStyle} blue-round-shadow-effect-div shadow-blue-blur ${displayExerciseDiv}`}></div>
            <div className={`exercise-div ${displayGridStyle} shadow-blue-solid ${displayExerciseDiv} outline`}>
                    {mappedExerciseVideo}
                    <button className="exercise-done-button button-primary primary-blue white-text" onClick={onClickUpdateExerciseDone}>exercise done</button>
            </div>
        </>
    )
}