import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { differenceInDays, endOfWeek, isSunday } from 'date-fns'
import { Context } from '../../Context'
import useModal from '../../customHooks/useModal/useModal'
import DropdownOption from '../DropdownOption'

import './WeeklyExerciseGoalForm.css'

export default function WeeklyExerciseGoalForm() {
    const { isAuth, 
            token, 
            userId, 
            exercisePerWeekArr, 
            setHasWeeklyExerciseGoal, 
            setWeeklyExerciseGoal, 
            weeklyExerciseGoal, 
            setWeeklyExerciseGoalSubmitDate, 
            isModalOpen, 
            toggleModal } = useContext(Context)

    const exercisePerWeekItem = exercisePerWeekArr.map(item=> <DropdownOption key={item} item={item} text='per week'/>)
    const history = useHistory()

    const endOfWeekDate = endOfWeek(new Date(), {weekStartsOn: 1})
    const daysLeftTillEndOfWeek = differenceInDays(endOfWeekDate, new Date())
    const isSundayToday = isSunday(new Date())

    const onChangeWeeklyExerciseGoal = (e) => {
        const valueInInt = parseInt(e.target.value)
        setWeeklyExerciseGoal(valueInInt)
    }

    const modalView = useModal(isModalOpen, 'Log in or create an account.', 'ask-for-log-in')


    const onSubmitWeeklyGoal = (e) => {
        console.log('submit goal triggered')
        e.preventDefault()
        if(isAuth) {
            const graphqlQuery = {
                query: `
                    mutation SetWeeklyExerciseGoal($userId: String!, $weeklyExerciseGoal: Int!) {
                        setWeeklyExerciseGoal(userId: $userId, weeklyExerciseGoal: $weeklyExerciseGoal) {
                                    __typename
                                    ...on User {
                                        weeklyExerciseGoal
                                        hasWeeklyExerciseGoal
                                        weeklyExerciseGoalSubmitDate
                                    }
                                    ...on FetchingFailed {
                                        message
                                    }
                                    ...on AddFailed {
                                        message
                                    }
                            
                        }
                    }
                `,
                variables: {
                    userId: userId,
                    weeklyExerciseGoal: weeklyExerciseGoal
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
            .then(res => {return res.json()})
            .then(resData => {
                console.log('response back')
                const graphqlResponse = resData.data.setWeeklyExerciseGoal
                // console.log('submit goal response',graphqlResponse)
                if(graphqlResponse.__typename === 'User') {
                    // console.log('weekly goal submitted')
                    // console.log('goal response',graphqlResponse.weeklyExerciseGoal)
                    setWeeklyExerciseGoal('')
                    setHasWeeklyExerciseGoal(graphqlResponse.hasWeeklyExerciseGoal)
                    // console.log('graphqlResponse.hasWeeklyExerciseGoal',graphqlResponse.hasWeeklyExerciseGoal)
                    // console.log('graphqlResponse.weeklyExerciseGoalSubmitDate in form', graphqlResponse.weeklyExerciseGoalSubmitDate)
                    const submitDate = new Date(graphqlResponse.weeklyExerciseGoalSubmitDate)
                    // console.log('submitDate in form',submitDate)
                    setWeeklyExerciseGoalSubmitDate(submitDate)
                    history.push('/')
                }
            })
            .catch(err => {
                console.log(err)
            }) 
        } else {
            // console.log('create an account')
            toggleModal()
            setWeeklyExerciseGoal('')
        }
    }

    const manyDays = daysLeftTillEndOfWeek > 1

    return(
        <>
            <div className={`weekly-goal blue-round-shadow-effect-div shadow-blue-blur`}></div>
            <div className={`weekly-goal weekly-exercise-goal-form-div shadow-blue-solid outline`}>
                    <h2 className="days-left">{ isSundayToday ? 'Last day of the week' : 
                            `${daysLeftTillEndOfWeek} day${manyDays ? 's' : ''} left till end of this week.`
                    }</h2>
                    <form className="weekly-exercise-goal-form" onSubmit={onSubmitWeeklyGoal}>
                        <div className="exercise-per-week-div select-per-week">
                            <select required
                            className="select-per-week-dropdown"
                            value = {weeklyExerciseGoal}
                            onChange={onChangeWeeklyExerciseGoal}
                        >
                            <option value={""}>▼ per week</option>
                                {exercisePerWeekItem}
                            </select>
                        </div>
                        <input className="goal-button" type="submit" value="Set goal"/>
                    </form>
            </div>
            {modalView}
        </>
    )
}