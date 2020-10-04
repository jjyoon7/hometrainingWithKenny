import React, { useContext, useEffect } from 'react'
import { Context } from '../../Context'
import './BodySectionOption.css'

export default function BodySectionOption({item}) {
    const { needToUpdateExerciseArr, setBodySectionError, radioChecked, setRadioChecked } = useContext(Context)

    const onClickRadio = () => setRadioChecked(true)

    const onBlurBodySectionOption = () => {
        setBodySectionError('')
    }

    useEffect(() => {

        setRadioChecked(false)
        //here arg is 'needToUpdateExerciseArr' because this is triggered when exercise form is submitted.
        //and when the form is submitted, radio option should reset
    }, [ needToUpdateExerciseArr ])

    return (
        <label className={`${item} body-section-radio`}> 
            <input 
                type="radio" 
                name="bodySection"
                key={item}
                value={item}
                onClick={onClickRadio}
                onBlur={onBlurBodySectionOption}
            /> {item}
             <span className={`checkmark ${ radioChecked ? 'body-section-radio-checked' : ''}`}></span>
        </label>
    )
}


