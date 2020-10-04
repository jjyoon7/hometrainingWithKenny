import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../Context'
import ExerciseElement from '../ExerciseElement/ExerciseElement'
import usePagination from '../../customHooks/usePagination/usePagination'
import SortByKeywordForm from '../SortByKeywordForm'
import './ExerciseList.css'

export default function ExeciseList() {
    const [ exerciseVideos, setExerciseVideos ] = useState(null)
    const { exerciseArr, 
            exerciseArrError, 
            setIsLoading, 
            perPage, 
            totalExercises, 
            needToUpdateExerciseArr, 
            setIsIndividualExercisePage, 
            setIsInUserExerciseProfilePage } = useContext(Context)

    const pagination = usePagination(totalExercises, perPage)

    useEffect(() => {
        setIsLoading(true)
        setIsIndividualExercisePage(false)
        const fetchedExercises = exerciseArr.map( exercise => {
                // console.log('exercise',exercise)
                return <ExerciseElement key={exercise._id} 
                                        id={exercise._id} 
                                        bodySection={exercise.bodySection}
                                        duration={exercise.duration}
                                        title={exercise.title} 
                                        videoUrl={exercise.videoUrl}
                                        totalRep={exercise.totalRep} 
                                        favorite={exercise.favorite}/>
        })
        
        setExerciseVideos(fetchedExercises)
        setIsLoading(false)

        //to update topThree component display to none.
        setIsInUserExerciseProfilePage(false)
        setIsIndividualExercisePage(false)

    }, [ exerciseArr, needToUpdateExerciseArr ])

    return (
        <>
            <div className={`center-column blue-round-shadow-effect-div shadow-blue-blur`}></div>
            <div className={`exercise-list-div center-column shadow-blue-solid outline`}>
                <ul className="exercise-list-ul">
                    <div className="exercise-list-li-div">
                        {exerciseVideos}
                        <h2 className="exercise-array-error-div">{exerciseArrError}</h2>
                    </div>
                    { exerciseArr.length > 0 ? pagination : '' }
                    <SortByKeywordForm/>
                </ul> 
            </div>
        </>
    )
}