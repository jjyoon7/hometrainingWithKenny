import React, { useContext } from 'react'
import { Context } from '../../Context'
import { differenceInDays, endOfWeek, isSunday } from 'date-fns'
import './WeeklyExerciseGoalCount.css'

export default function WeeklyExerciseGoalCount() {
    const { finishedExerciseRound, weeklyExerciseGoal, weeklyExerciseGoalSubmitDate } = useContext(Context)

    const endOfWeekDate = endOfWeek(weeklyExerciseGoalSubmitDate, {weekStartsOn: 1})
    const daysLeftTillEndOfWeek = differenceInDays(endOfWeekDate, new Date())

    const isExerciseGoalAchieved = finishedExerciseRound >= weeklyExerciseGoal
    const manyDays = daysLeftTillEndOfWeek > 1
    const isSundayToday = isSunday(new Date())

    return (
        <> 
            <div className={`weekly-goal blue-round-shadow-effect-div shadow-blue-blur`}></div>
            <div className={`weekly-goal weekly-exercise-goal-form-div shadow-blue-solid outline`}>
                    { isSundayToday ? 
                                    <h2>Last day</h2> : 
                                    <h2>{daysLeftTillEndOfWeek} day{manyDays ? 's' : ''} till end of week</h2>  
                    }
                    <h2>Exercise goal is {weeklyExerciseGoal}</h2>
                    { isExerciseGoalAchieved ? <h2>Goal achieved!</h2> : <h2>You did {finishedExerciseRound}</h2> }
            </div>
        </>
    )
}