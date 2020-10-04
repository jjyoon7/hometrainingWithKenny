import React, { useState, useEffect } from 'react'
import { getWeek, isMonday, isSunday } from 'date-fns'
const Context = React.createContext()

function ContextProvider(props) {

    //for authorization check up
    const [ isAuth, setIsAuth ] = useState(false)
    const [ token, setToken ] = useState(null)
    const [ userId, setUserId ] = useState('')

    //user name for the bubble message from Kenny
    const [ userName, setUserName ] = useState('')

    //for pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ perPage, setPerPage ] = useState(3)
    const [ totalExercises, setTotalExercises ] = useState(0)
  
    //for creating exercise request form
    const [ bodySectionArr, setBodySectionArr ] = useState(['Upper', 'Core', 'Lower'])
    const [ durationArr, setDurationArr ] = useState(['5', '10', '15', '20', '25', '30', '60'])
    const [ exercisePerWeekArr, setExercisePerWeek ] = useState(['1', '2', '3', '4', '5', '6', '7'])

    //bodySection error, shared between ExerciseForm and BodySectionOption
    const [ bodySectionError, setBodySectionError ] = useState('')

    //user workout time 
    const [ updateUserWorkoutTime, setUpdateUserWorkoutTime ] = useState(false)

    //for setting weekly exercise goal and show if user succeeded
    const [ hasWeeklyExerciseGoal, setHasWeeklyExerciseGoal ] = useState(false)
    const [ weeklyExerciseGoal, setWeeklyExerciseGoal ] = useState(0)
    const [ isWeeklyExerciseGoalAchieved, setIsWeeklyExerciseGoalAchieved ] = useState(false)
    const [ finishedExerciseRound, setFinishedExerciseRound ] = useState(0)
    const [ weeklyExerciseGoalSubmitDate, setWeeklyExerciseGoalSubmitDate ] = useState(null)
    const [ isResetWeeklyGoalTriggered, setIsResetWeeklyGoalTriggered ] = useState(false)

    //for sorting list by keywords
    const sortByKeywordArr = [ 'favorite', 'newest', 'oldest', 'min. short - long', 'min. long - short', 'only upper', 'only core', 'only lower' ]
    const [ sortByKeyword, setSortByKeyword ] = useState('')
    
    //to store exercises data 
    const [ exerciseArr, setExerciseArr ] = useState([])

    //to show errors based on each arrays
    const [ exerciseArrError, setExerciseArrError ] =useState('') 
    const [ topThreeExercisesArr, setTopThreeExercisesArr ] = useState([])

    //users information about total workout time
    //and workout time per bodySection for the UserExerciseProfile page
    const [ totalWorkoutTime, setTotalWorkoutTime ] = useState(0)
    const [ upperTotalWorkoutTime, setUpperTotalWorkoutTime ] = useState(0)
    const [ coreTotalWorkoutTime, setCoreTotalWorkoutTime ] = useState(0)
    const [ lowerTotalWorkoutTime, setLowerTotalWorkoutTime ] = useState(0)
    
    //to update values, which will re-render the useEffect in Context
    //to fetch exercises from DB
    const [ needToUpdateExerciseArr, setNeedToUpdateExerciseArr ] = useState(false)
    const [ needToUpdateTopThreeExerciseArr, setNeedToUpdateTopThreeExerciseArr ] = useState(false)

    //isLoading?
    const [ isLoading, setIsLoading ] = useState(false)

    //to show where(which component) user triggered the action / event
    const [ isIndividualExercisePage, setIsIndividualExercisePage ] = useState(false)

    //to add different class or switch visual element based on the width of the window
    const [ width, setWidth ] = useState(window.innerWidth)
    const [ isMobileScreen, setIsMobileScreen ] = useState(false)
    const [ rootGridStyle, setRootGridStyle ] = useState('homepage-div')

    //to set different message of Kenny's bubble, based on which page user is on.
    const [ kennysMessage, setKennysMessage ] = useState('')
    const [ isInVerifyEmailPage, setIsInVerifyEmailPage ] = useState(false)
    const [ isInSignupPage, setIsInSignupPage ] = useState(false)
    const [ isInForgotPasswordPage, setIsInForgotPasswordPage ] = useState(false)
    const [ isInResetPasswordPage, setIsInResetPasswordPage ] = useState(false)
    const [ isInUserExerciseProfilePage, setIsInUserExerciseProfilePage ] = useState(false)
    const [ isAutoLogoutTriggered, setIsAutoLogoutTriggered ] = useState(false)

    //to create modal
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const toggleModal = () => setIsModalOpen(!isModalOpen)

    //radio checked option, shared between ExerciseForm and BodySectionOption component
    const [ radioChecked, setRadioChecked ] = useState(false)

    const toggleRootGrid = () => {
        setWidth(window.innerWidth)
    }

    //when there is an update in window width
    //or user is logged in, it will listen for the resize event listner.
    //it is always 1 behind.
    //need a new logic
    useEffect(() => {
        if(width <= 995 && isAuth) {
            setIsMobileScreen(true)
            setRootGridStyle('homepage-div-mobile-auth-true')
        } else if(width <= 995) {
            setIsMobileScreen(true)
            setRootGridStyle('homepage-div-mobile')
        } else if(width > 995){
            setIsMobileScreen(false)
            setRootGridStyle('homepage-div')
        }
        window.addEventListener("resize", toggleRootGrid)
        return () => window.removeEventListener("resize", toggleRootGrid)
    }, [ width, isAuth ])

    const logoutHandler = () => {
      setIsAuth(false)
      setToken(null)
      
      localStorage.removeItem('token')
      localStorage.removeItem('expiryDate')
      localStorage.removeItem('userId') 
      setWeeklyExerciseGoal(0)
    }
  
    const setAutoLogout = milliseconds => {
        setTimeout(() => {
          logoutHandler()
          toggleModal()
          setIsAutoLogoutTriggered(true)
          setKennysMessage('Log in or create an account!')
        }, milliseconds)
    }
  
    //when app first renders, this will trigger to check
    //validation of user
    //or exixtence of the token.
    useEffect(() => {
      const token = localStorage.getItem('token')
      const expiryDate = localStorage.getItem('expiryDate')
      //if there is no token which means isAuth is false,
      //user is not authorized so return without chaning isAuth to true.
      if (!token || !expiryDate) {
        return
      }
      if (new Date(expiryDate) <= new Date()) {
        logoutHandler()
        return
      }
      const userId = localStorage.getItem('userId')
      const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime()
        
      setIsAuth(true)
      setToken(token)
      setUserId(userId)

      setAutoLogout(remainingMilliseconds)
    }, [])

    //fetch all the exercises in mongoDB
    useEffect(() => {
        if(isAuth) {
            //set keyword to none, so it will show all the exercises in order of - most recent
            const graphqlQuery = {
                query: `
                    query FetchExercises($userId: String!, $page: Int, $perPage: Int, $sortByKeyword: String) {
                        exercises(userId: $userId, page: $page, perPage: $perPage, sortByKeyword: $sortByKeyword) {
                            __typename
                            ...on ExerciseData {
                                exercises {
                                    _id
                                    title
                                    bodySection
                                    duration
                                    videoUrl
                                    favorite
                                    totalRep
                                }
                                totalExercises
                                currentPage
                            }
                            ...on FetchingFailed {
                                message
                            }
                            ...on EmptyArray {
                                message
                            }
                        }
                    }
                `,
                variables: {
                    page: currentPage,
                    perPage,
                    userId,
                    sortByKeyword: sortByKeyword
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

                //will get the exercises data
                //which needs to be rendered as ExerciseVideo elements
                //then show thos rendered components

                const graphqlResponse = resData.data.exercises
                if(graphqlResponse.__typename === 'ExerciseData') {
                    setTotalExercises(graphqlResponse.totalExercises)
                    setExerciseArr(graphqlResponse.exercises)
                    // console.log('exercises data from mogoDB',graphqlResponse.exercises)
                }
                if(graphqlResponse.exercises.length === 0 && currentPage === 1 ) {
                    //show error and return empty exercises array
                    setExerciseArrError('No exercise under this category.')
                } else {
                    setExerciseArrError('')
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }

        //if the user is logged in, - which means that user has 'token'
        //and request from ExerciseForm has been made, - which is 'needToUpdateExerciseArr'
        //then it should render this useEffect function.
        //also render when exercise has been moved to favorite, 
        //which means it should delete from ExerciseList component
        //and move that exercise to ExerciesListFavorite
    }, [userId, token, currentPage, needToUpdateExerciseArr, sortByKeyword ])

    //get top 3 of user's favorite exercises, with most totalRep
    useEffect(() => {
        if(isAuth) {
            const graphqlQuery = {
                query: `
                    query TopThreeExercises($userId: String!) {
                        topThreeExercises(userId: $userId) {
                                __typename 
                                ...on TopThreeExercises {
                                    topThreeExercises {
                                        _id
                                        videoUrl
                                        favorite
                                        totalRep
                                        bodySection
                                        duration
                                        title
                                    }
                                }
                                ...on UserNotFound {
                                    message
                                }
                                ...on FetchingFailed {
                                    message
                                }
                                ...on EmptyArray {
                                    message
                                }
                        }
                    }
                 `,
                 variables: {
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
            .then(res => { return res.json() })
            .then(resData => {
                // console.log(resData.data)
                const graphqlResponse = resData.data.topThreeExercises
                if(graphqlResponse.__typename === 'TopThreeExercises') {
                    setTopThreeExercisesArr(graphqlResponse.topThreeExercises)
                }
            })
            .catch(err => console.log(err))
        }
    }, [ token, userId, exerciseArr, finishedExerciseRound ])

    //fetch if user has weeklyExerciseGoal
    useEffect(() => {
            if(isAuth) {
                const graphqlQuery = {
                    query: `
                        query GetUser($userId: String!) {
                            user(userId: $userId) {
                                __typename
                                ...on User {
                                    name
                                    weeklyExerciseGoal
                                    finishedExerciseRound
                                    hasWeeklyExerciseGoal
                                    weeklyExerciseGoalSubmitDate
                                    totalWorkoutTime
                                    upperTotalWorkoutTime
                                    coreTotalWorkoutTime
                                    lowerTotalWorkoutTime
                                }
                                ...on UserNotFound {
                                    message
                                }
                                ...on FetchingFailed {
                                    message
                                }
                            }
                        }
                    `,
                    variables: {
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
                .then(res => { return res.json() })
                .then(resData => {
                    const graphqlResponse = resData.data.user
                    // console.log('graphqlResponse in user fetching query',graphqlResponse)
                    if(graphqlResponse.__typename === 'User') {
                        setWeeklyExerciseGoal(graphqlResponse.weeklyExerciseGoal)
                        setFinishedExerciseRound(graphqlResponse.finishedExerciseRound)
                        setHasWeeklyExerciseGoal(graphqlResponse.hasWeeklyExerciseGoal)
                        const submitDate = new Date(graphqlResponse.weeklyExerciseGoalSubmitDate)
                        setWeeklyExerciseGoalSubmitDate(submitDate)
                        setUserName(graphqlResponse.name)

                        setTotalWorkoutTime(graphqlResponse.totalWorkoutTime)
                        setUpperTotalWorkoutTime(graphqlResponse.upperTotalWorkoutTime)
                        setCoreTotalWorkoutTime(graphqlResponse.coreTotalWorkoutTime)
                        setLowerTotalWorkoutTime(graphqlResponse.lowerTotalWorkoutTime)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
    
    }, [ userId, token, hasWeeklyExerciseGoal ])

    //reset weeklyExerciseGoal and weeklyExerciseGoalSubmitDate
    //if the week has started again
    //maybe only call this when it is a monday,
    useEffect(() => {
        //if the week that has weeklyExerciseGoalSubmitDate
        //is not same as current date's week
        //then reset
        if(isAuth) {
            //if today is monday - which means start of the week
            //check if user has weeklyExerciseGoalSubmitDate
            const today = new Date()
            const currentWeek = getWeek(today)
            const isItStartOfTheWeek = isMonday(today)
            const weekWithExerciseGoal = getWeek(weeklyExerciseGoalSubmitDate)

            //use can have exercise goal from last week.
            //so need a new logic
            //if this week and user's exerciseSubmitDate week is not the same.
            const isItDifferentWeek = currentWeek !== weekWithExerciseGoal

            if(isItStartOfTheWeek && isItDifferentWeek && !isResetWeeklyGoalTriggered) {
                setIsResetWeeklyGoalTriggered(true)
                const graphqlQuery = {
                    query: `
                        mutation ResetWeeklyData($userId: String!) {
                            resetWeeklyData(userId: $userId) {
                                __typename 
                                ...on User {
                                    finishedExerciseRound
                                    hasWeeklyExerciseGoal
                                    weeklyExerciseGoal
                                    isWeeklyExerciseGoalAchieved
                                    weeklyExerciseGoalSubmitDate
                                }
                                ...on UserNotFound {
                                    message
                                }
                                ...on ResetFailed {
                                    message
                                }
                            }
                        }
                    `,
                    variables: {
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
                .then(res => { return res.json() })
                .then(resData => {
                    const graphqlResponse = resData.data.resetWeeklyData
                    if(graphqlResponse.__typename === 'User') {
                        setWeeklyExerciseGoal(graphqlResponse.weeklyExerciseGoal)
                        setIsWeeklyExerciseGoalAchieved(graphqlResponse.isWeeklyExerciseGoalAchieved)
                        setFinishedExerciseRound(graphqlResponse.finishedExerciseRound)
                        setWeeklyExerciseGoalSubmitDate(graphqlResponse.weeklyExerciseGoalSubmitDate)
                        setHasWeeklyExerciseGoal(graphqlResponse.hasWeeklyExerciseGoal)
                    }
                })
                .catch(err => console.log(err))
            } else {
                return
            }
        }
    }, [ userId, token ])

    //on sunday, reset 'isResetWeeklyGoalTriggered' to false
    //doing it on sunday, since monday is the date that resetData is called
    //when user log in.
    useEffect(() => {
        const today = new Date()
        const isItSunday = isSunday(today)
        if(isItSunday) {
            setIsResetWeeklyGoalTriggered(false)
        }
    }, [])
   
    //set different message in Kenny's bubble
    useEffect(() => {
        if(isInVerifyEmailPage) {
            setKennysMessage(`Almost there! After this you can play fetch with me!`)
        } else if(isInForgotPasswordPage) {
            setKennysMessage('No worries, I will fetch you a password!')
        } else if(isInResetPasswordPage) {
            setKennysMessage(`Let's reset your password!`)
        } else if(isAuth && isIndividualExercisePage) {
            setKennysMessage(`Mark done to update repetition, ${userName}!`) 
        } else if(isAuth && isInUserExerciseProfilePage) {
            setKennysMessage(`Check your progress, ${userName}!`) 
        } else if(isAuth && isWeeklyExerciseGoalAchieved) {
            setKennysMessage(`You did it ${userName}! Your weekly exercise goal is complete!`)
        } else if(isAuth && userName) {
            setKennysMessage(`Let me fetch you an exercise, ${userName}!`)  
        } else if(!isAuth) {
            setKennysMessage('Log in or create an account!')
        } 
    }, [ isAuth, isInVerifyEmailPage, isWeeklyExerciseGoalAchieved, isInForgotPasswordPage, isInResetPasswordPage, userName, isInUserExerciseProfilePage ])
    
    return (
        <Context.Provider value={{
                                  bodySectionArr,
                                  durationArr,
                                  setDurationArr,  
                                  exerciseArr,
                                  setExerciseArr,
                                  token,
                                  setToken,
                                  userId,
                                  setUserId,
                                  isAuth,
                                  setIsAuth,
                                  logoutHandler,
                                  setAutoLogout, 
                                  isLoading,
                                  setIsLoading,
                                  currentPage,
                                  setCurrentPage,
                                  perPage,
                                  setPerPage,
                                  totalExercises,
                                  setTotalExercises,
                                  needToUpdateExerciseArr,
                                  setNeedToUpdateExerciseArr,
                                  isModalOpen,
                                  setIsModalOpen,
                                  exercisePerWeekArr,
                                  setExercisePerWeek,
                                  isIndividualExercisePage,
                                  setIsIndividualExercisePage,
                                  weeklyExerciseGoal,
                                  setWeeklyExerciseGoal,
                                  isWeeklyExerciseGoalAchieved,
                                  setIsWeeklyExerciseGoalAchieved,
                                  finishedExerciseRound,
                                  setFinishedExerciseRound,
                                  hasWeeklyExerciseGoal,
                                  setHasWeeklyExerciseGoal,
                                  weeklyExerciseGoalSubmitDate,
                                  setWeeklyExerciseGoalSubmitDate,
                                  sortByKeyword,
                                  setSortByKeyword,
                                  sortByKeywordArr,
                                  topThreeExercisesArr,
                                  exerciseArrError,
                                  totalWorkoutTime, 
                                  setTotalWorkoutTime,
                                  upperTotalWorkoutTime, 
                                  setUpperTotalWorkoutTime,
                                  coreTotalWorkoutTime, 
                                  setCoreTotalWorkoutTime,
                                  lowerTotalWorkoutTime, 
                                  setLowerTotalWorkoutTime,
                                  width,
                                  isMobileScreen,
                                  userName,
                                  rootGridStyle,
                                  isInVerifyEmailPage, 
                                  setIsInVerifyEmailPage,
                                  kennysMessage,
                                  isInForgotPasswordPage,
                                  setIsInForgotPasswordPage,
                                  isInResetPasswordPage,
                                  setIsInResetPasswordPage,
                                  toggleModal,
                                  toggleRootGrid,
                                  isInUserExerciseProfilePage,
                                  setIsInUserExerciseProfilePage,
                                  updateUserWorkoutTime,
                                  setUpdateUserWorkoutTime,
                                  isInSignupPage,
                                  setIsInSignupPage,
                                  setIsResetWeeklyGoalTriggered,
                                  isAutoLogoutTriggered, 
                                  setIsAutoLogoutTriggered,
                                  needToUpdateTopThreeExerciseArr,
                                  setNeedToUpdateTopThreeExerciseArr,
                                  bodySectionError,
                                  setBodySectionError,
                                  radioChecked,
                                  setRadioChecked,
                                }}>
            {props.children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }