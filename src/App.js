import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Context } from './Context'

import ExerciseForm from './components/ExerciseForm/ExerciseForm'
import ExerciseList from './components/ExerciseList/ExerciseList'
import Exercise from './pages/Exercise/Exercise'
import Manual from './components/Manual/Manual'
import Signup from './pages/Auth/Signup/Signup'
import Login from './pages/Auth/Login/Login'
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword'
import VerifyEmail from './pages/Auth/VerifyEmail/VerifyEmail'
import ResetPassword from './pages/Auth/ResetPassword/ResetPassword'
import NavBar from './components/NavBar/NavBar'
import PageNotFound from './pages/PageNotFound/PageNotFound'
import UserExerciseInfo from './components/UserExerciseInfo/UserExerciseInfo'
import WeeklyExerciseGoalForm from './components/WeeklyExerciseGoalForm/WeeklyExerciseGoalForm'
import WeeklyExerciseGoalCount from './components/WeeklyExerciseGoalCount/WeeklyExerciseGoalCount'
import TopThreeExercises from './components/TopThreeExercises/TopThreeExercises'
import KennyVisual from './components/KennyVisual/KennyVisual'
import Logo from './components/Logo/Logo'
import Bubble from './components/Bubble/Bubble'
import './App.css'
import AutoLogoutMessage from './components/AutoLogoutMessage/AutoLogoutMessage'


function App() {
  const { isAuth, 
          isMobileScreen, 
          isAutoLogoutTriggered, 
          hasWeeklyExerciseGoal, 
          rootGridStyle } = useContext(Context)

  const authenticatedView = <>
                              <ExerciseList/>
                            </> 
  const unAuthenticatedView = <>
                                { isMobileScreen ? null : <Login/> }
                              </>    

  return (
    <div className={`App ${rootGridStyle}`}>
      <AutoLogoutMessage /> 
      <Logo/>
      <NavBar />
      <Bubble/>
      <KennyVisual/>
      <Switch>
          <Route exact path="/">
              { hasWeeklyExerciseGoal && isAuth ? <WeeklyExerciseGoalCount/> : <WeeklyExerciseGoalForm /> }
              <ExerciseForm/>
              <Manual/>
              {isAuth ? authenticatedView : unAuthenticatedView }
          </Route>

          <Route path="/signup">
              <Signup/>
          </Route>

          {/* needed for the mobile screen, seperate log in page*/}
          <Route path="/login">
              <Login/>
          </Route>

          <Route path="/confirmation/:verificationToken">
              <VerifyEmail/>
          </Route>

          <Route exact path="/forgot-password">
              <ForgotPassword/>
          </Route>

          <Route exact path="/reset/:refreshToken">
              <ResetPassword/>
          </Route>

          <Route path="/exercise/:exerciseId">
            {isAuth ? <>
                        <WeeklyExerciseGoalCount/>
                        <UserExerciseInfo />
                        <Exercise />
                      </> : <Login/> }
          </Route>

          <Route path="/user/:userId">
          {isAuth ? <>
                      <UserExerciseInfo />
                      <WeeklyExerciseGoalCount/>
                      <TopThreeExercises />
                    </> : <Login/> }
          </Route>

          <Route>
            <PageNotFound />
          </Route>
      </Switch>
      {/* positioned here, to put the display message in all path */}
      {/* also to overwrite the modal messages from 'ExerciseForm' */}
      { isAutoLogoutTriggered ? <AutoLogoutMessage /> : ''}
    </div>
  )
}

export default App
