import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Context } from '../../../Context'

import './Login.css'

export default function Login() {
    const { setIsAuth, 
            setToken, 
            setUserId, 
            setAutoLogout, 
            isMobileScreen, 
            toggleRootGrid, 
            setSortByKeyword } = useContext(Context)

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ emailError, setEmailError ] = useState('')
    const [ passwordError, setPasswordError ] = useState('')
    const [ verificationError, setVerificationError ] = useState('')

    const history = useHistory()

    const onChangeEmail = e => setEmail(e.target.value)
    const onChangePassword = e => setPassword(e.target.value)

    const goToCreateAccountPage = () => {
        history.push('/signup')
    }

    const onSubmitLogin = (e) => {
        e.preventDefault()

        //reset the error message, when user submit again
        setEmailError('')
        setPasswordError('')
        setVerificationError('')

        const graphqlQuery = {
          query: `
            query UserLogin($email: String!, $password: String!){
              login(email: $email, password: $password) {
                __typename
                ...on AuthData {
                    token
                    userId
                }
                ...on EmailNotFound {
                   message
                }
                ...on PasswordIncorrect {
                   message
                }
                ...on NotVerified {
                   message
                }

              }
            }
          `,
          variables: {
            email,
            password
          }
        }
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphqlQuery)
          })
            .then(res => {
              return res.json()
            })
            .then(resData => {

              const graphqlResponse = resData.data.login

              if (graphqlResponse.__typename === 'AuthData') {
                // console.log('login component, changing isAuth to true')
                setIsAuth(true)
                setToken(graphqlResponse.token)
                setUserId(graphqlResponse.userId)

                localStorage.setItem('token', graphqlResponse.token)
                localStorage.setItem('userId', graphqlResponse.userId)
                const remainingMilliseconds = 60 * 60 * 1000
                const expiryDate = new Date(
                  new Date().getTime() + remainingMilliseconds
                )
                localStorage.setItem('expiryDate', expiryDate.toISOString())
                setAutoLogout(remainingMilliseconds)
                history.push('/')

                toggleRootGrid()
                setSortByKeyword('')
              }

              if (graphqlResponse.__typename === 'EmailNotFound') {  
                setEmailError('Email not found.')
              }

              if (graphqlResponse.__typename === 'PasswordIncorrect') {  
                setPasswordError('Password incorrect.')
              }

              if (graphqlResponse.__typename === 'NotVerified') {  
                setVerificationError('Email not verified.')
              }
            })
            .catch(err => {
              console.log(err)
              setIsAuth(false)
            })
    }

    return (
      <>
        <div className={ isMobileScreen ? "div manual blue-round-shadow-effect-div shadow-blue-blur" : "div center-column blue-round-shadow-effect-div shadow-blue-blur"}></div>
        <div className={ isMobileScreen ? "log-in-div manual shadow-blue-solid outline" : "log-in-div center-column shadow-blue-solid outline"}>
            <form
              className="log-in-form"
              onSubmit={onSubmitLogin}
            >  
              <h2 className="log-in-title primary-blue-text">Log in</h2>
              <div className="log-in-email">
                  <input
                    type="email"
                    placeholder="Your E-Mail"
                    onChange={onChangeEmail}
                    value={email}
                  />
                  <div className="log-in-email-error">
                    {emailError}
                    {verificationError}
                  </div>
              </div>  
              <div className="log-in-password">
                  <input
                    type="password"
                    placeholder="password"
                    onChange={onChangePassword}
                    value={password}
                  />
                  <div className="log-in-password-error">{passwordError}</div>
              </div>
              <button className="log-in-button button-primary primary-blue white-text" type="submit">
                Login
              </button>

              <button className="create-account-button button-secondary" onClick={goToCreateAccountPage}>
                  create an account
              </button>
            </form>
            <div className="forgot-password-button" >
                <a href="http://localhost:3000/forgot-password">
                    forgot the password?
                </a>
            </div>
        </div>
      </>
    )
}