import React, { useState, useContext } from 'react'
import { Context } from '../../Context'
import { useHistory } from 'react-router-dom'
import useModal from '../../customHooks/useModal/useModal'
import BodySectionOption from '../BodySectionOption/BodySectionOption'
import DropdownOption from '../DropdownOption'


import './ExerciseForm.css'

export default function ExerciseForm() {
    const { isAuth, 
            bodySectionArr, 
            durationArr, 
            token, 
            setNeedToUpdateExerciseArr, 
            setWeeklyExerciseGoalSubmitDate, 
            toggleModal, 
            isModalOpen, 
            setBodySectionError, 
            setRadioChecked } = useContext(Context)

    const [ bodySection, setBodySection ] = useState('')
    const [ duration, setDuration ] = useState('')
    const [ durationError, setDurationError ] = useState('')
    const [ fetchingError, setFetchingError ] = useState('')

    const history = useHistory()
    
    const bodySectionItem = bodySectionArr.map(item => <BodySectionOption key={item} item={item}/>)    
    const durationItem = durationArr.map(item => <DropdownOption key={item} item={item} text='min.'/>)
    
    const onChangeBodySection = e => {
        setBodySection(e.target.value)
    }
    const onChangeDuration = e => setDuration(e.target.value)

    const modalView = useModal(isModalOpen, 'Log in or create an account.')
    const modalViewBodySectionError = useModal(isModalOpen, 'Body section is missing')

    const onSubmitExercise = (e) => {
        e.preventDefault()

        setBodySectionError('')
        setDurationError('')
        setFetchingError('')
        setNeedToUpdateExerciseArr(false)
        setWeeklyExerciseGoalSubmitDate(new Date())

        if(isAuth) {
            const graphqlQuery = {
                query: `
                    mutation CreateNewExercise( $bodySection: String!, $duration: String! ){
                        createExerciseRequest(exerciseInput: {
                                                bodySection: $bodySection
                                                duration: $duration
                                            }) {
                                                __typename
                                                ...on Exercise {
                                                    _id
                                                    bodySection
                                                    duration
                                                    title
                                                    videoUrl
                                                    favorite
                                                }
                                                ...on BodySectionMissing {
                                                    message
                                                }
                                                ...on DurationMissing {
                                                    message
                                                }
                                                ...on FetchingFailed {
                                                    message
                                                }
                                            }    
                    }
                `,
                variables: {
                    bodySection,
                    duration
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

                const graphqlResponse = resData.data.createExerciseRequest

                if (graphqlResponse.__typename === 'BodySectionMissing') {
                  setBodySectionError('select section')
                  toggleModal()
                }
                if(graphqlResponse.__typename === 'DurationMissing') {
                  setDurationError('Duration missing.')
                }
                if(graphqlResponse.__typename === 'FetchingFailed') {
                  setFetchingError('Fetching failed.')
                }
                if(graphqlResponse.__typename === 'Exercise') {
                  setNeedToUpdateExerciseArr(true)
                  setBodySection('')
                  setDuration('')
                  history.push('/')
                }
            })
            .catch(err => {
                console.log(err)
            })
        } else {
            //show modal to create account or login
            toggleModal()
            setBodySection('')
            setDuration('')
            setRadioChecked(false)
        }
    }

    return (
        <>
            <div className={ `exercise-form blue-round-shadow-effect-div shadow-blue-blur`}></div>
            <div className={ `exercise-form-div exercise-form shadow-blue-solid outline`}>               
                <form className="exercise-form-grid" onSubmit={onSubmitExercise}>
                    <div className="exercise-body-section-radio radio-option"
                         onChange={onChangeBodySection}
                    >
                        {bodySectionItem}
                        {isAuth ? modalViewBodySectionError : ''}
                    </div>
                    <div className="exercise-duration-div select-min">
                        <select required
                            className="exercise-duration-select"
                            value = {duration}
                            onChange={onChangeDuration}
                        >
                            <option value={""}>▼ min.</option>
                            {durationItem}
                        </select>
                        {durationError}
                    </div>
                    <input className="fetch-button button-primary" type="submit" value="Fetch"/>
                </form>
                {fetchingError}
            </div>
            {modalView}
        </>
    )
}