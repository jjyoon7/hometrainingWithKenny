import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../Context'
import { Link, useHistory } from 'react-router-dom'
import './ExerciseElement.css'

export default function ExerciseElement({id, bodySection, duration, title, videoUrl, favorite, totalRep}) {
    const { token, 
            setNeedToUpdateExerciseArr, 
            isIndividualExercisePage, 
            setNeedToUpdateTopThreeExerciseArr, 
            exerciseArr, 
            currentPage, 
            setCurrentPage } = useContext(Context)

    const [ hovered, setHovered ] = useState(false)
    const [ hoveredExerciseNoteIcon, setHoveredExerciseNoteIcon ] = useState(false)
    const [ hoveredDeleteIcon, setHoveredDeleteIcon ] = useState(false)
    const [ isFavorite, setIsFavorite ] = useState(favorite)
    const [ displayExerciseElementLiStyle, setDisplayExerciseElementLiStyle ] = useState('')

    const history = useHistory()

    useEffect(() => {
        if(isIndividualExercisePage) {
            setDisplayExerciseElementLiStyle('exercise-item-li-individual')
        } else {
            setDisplayExerciseElementLiStyle('exercise-item-li')
        }
    }, [ isIndividualExercisePage ])

    function heartIcon() {
        if(isFavorite  || hovered) {
            return <i className="ri-heart-fill" onClick={() => toggleFavorite(id)}></i>
        } else {
            return <i className="ri-heart-line" onClick={() => toggleFavorite(id)}></i>
        }
    }

    const toggleFavorite = (id) => {

        setNeedToUpdateExerciseArr(false)
        setIsFavorite(!isFavorite)

        const graphqlQuery = {
            query: `
                mutation ToggleFavoriteExercise($id: ID!) {
                    toggleFavoriteExercise(id: $id) {
                        __typename
                        ...on Exercise {
                            _id
                            favorite
                        }
                        ...on AddFailed {
                            message
                        }
                        ...on ExerciseNotFound {
                            message
                        }
                    }
                }
            `,
            variables: {
                id
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
            const graphqlResponse = resData.data.toggleFavoriteExercise

            if(graphqlResponse.__typename === 'Exercise') {
                setNeedToUpdateExerciseArr(true)
              }  
            if(graphqlResponse.__typename === 'ExerciseNotFound') {
                //set error
            }
            if(graphqlResponse.__typename === 'AddFailed') {
                //set error
            }
        })
        .catch(err => console.log(err))
    }

    function exerciseNoteIcon() {
        if (hoveredExerciseNoteIcon)  {
            return <Link className="exercise-link" to={`/exercise/${id}`} key={id}>
                        <i className="ri-todo-fill"></i>
                   </Link>
        } else {
            return <Link className="exercise-link" to={`/exercise/${id}`} key={id}>
                        <i className="ri-todo-line"></i>
                   </Link>
        }
    }

    function deleteIcon() {
        if (hoveredDeleteIcon)  {
            return <i className="ri-delete-bin-fill" onClick={() => deleteExercise(id)}></i>
        } else {
            return <i className="ri-delete-bin-line" onClick={() => deleteExercise(id)}></i>
        }
    }

    const deleteExercise = (id) => {
        setNeedToUpdateExerciseArr(false)
        setNeedToUpdateTopThreeExerciseArr(false)

        const graphqlQuery = {
            query: `
                mutation DeleteExercise($id: ID!) {
                    deleteExercise(id: $id) {
                        _id
                    }
                }
            `,
            variables: {
                id
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
            //hasDeleteReqSent is param to update useEffect in Context, 
            //useEffect that fetch 'exercises' or 'favorite exercises' from mongoDB
            setNeedToUpdateExerciseArr(true)
            setNeedToUpdateTopThreeExerciseArr(true)

            //in order to reset the page to previous page,
            //when last element of the page is deleted,
            //exerciseArr.length should be 1, not 0
            if(exerciseArr.length === 1 && currentPage !== 1) {
                setCurrentPage(currentPage - 1)
            }
            if(isIndividualExercisePage) {
                history.push('/')
            }
        })
        .catch(err => console.log(err))   
    }

    const hoveredTrue = () => {
        setHovered(true)
    }
    const hoveredFalse = () => {
        setHovered(false)
    }

    const hoveredDeleteIconTrue = () => {
        setHoveredDeleteIcon(true)
    }
    const hoveredDeleteIconFalse = () => {
        setHoveredDeleteIcon(false)
    }

    const hoveredExerciseNoteTrue = () => {
        setHoveredExerciseNoteIcon(true)
    }
    const hoveredExerciseNoteFalse = () => {
        setHoveredExerciseNoteIcon(false)
    }

    return (
        <li className={displayExerciseElementLiStyle}>
            <div className="exercise-item-div">
                <h2 className="exercise-title">{`${bodySection} ${duration}`}</h2>
                <div className="icons-div">
                    <div className="heart-icon" 
                         onMouseEnter={hoveredTrue} 
                         onMouseLeave={hoveredFalse}  >
                        {heartIcon()}
                    </div>

                    {/* only show when it is normal list */}
                    { !isIndividualExercisePage ?        
                        <div className="note-icon" 
                             onMouseEnter={hoveredExerciseNoteTrue} 
                             onMouseLeave={hoveredExerciseNoteFalse}  >
                            {exerciseNoteIcon()}
                        </div>   
                    : null }

                    {/* always show delete */}
                    <div className="trash-icon" 
                                 onMouseEnter={hoveredDeleteIconTrue} 
                                 onMouseLeave={hoveredDeleteIconFalse}  >
                                {deleteIcon()}
                    </div>
                </div>
                <iframe className='video-element' src={videoUrl} frameBorder='0'
                  allow='encrypted-media' allowFullScreen />
            </div>
        </li>
    )
}