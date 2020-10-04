import React, { useState, useContext, useEffect } from 'react'
import { validateEmail } from '../../../utils/validators'
import { Context } from '../../../Context'
import useModal from '../../../customHooks/useModal/useModal'

import './ForgotPassword.css'

export default function ForgotPassword() {
    const { isMobileScreen, setIsInForgotPasswordPage, isModalOpen, toggleModal } = useContext(Context)
    const [ email, setEmail ] = useState('')
    const [ resetError, setResetError ] = useState('')
    const [ isValid, setIsValid ] = useState(false)
    const [ divGridStyle, setDivGridStyle ] = useState('')

    const modalViewForgotPassword = useModal(isModalOpen, 'Reset email has been sent.', 'forgot-password')

    const onChangeEmail = e => setEmail(e.target.value)

    useEffect(() => {
      setIsInForgotPasswordPage(true)
    }, [])

    useEffect(() => {
      if(isMobileScreen) {
        setDivGridStyle('manual')
      } else {
        setDivGridStyle('center-column')
      }
    }, [ isMobileScreen ])

    const validationCheckup = () => {
        const emailValidated = validateEmail(email)

        // console.log('validation triggered', emailValidated)

        if(!emailValidated) {
          setResetError('Invalid email.')
        }

        if(email.length <= 0) {
          setResetError('Email cannot be empty.')
        } 

        if(emailValidated) {
          setResetError('')
          setIsValid(true)
          
          return isValid
        }
    }

    const onSubmitReset = (e) => {
        e.preventDefault()
        validationCheckup()
        if(isValid) {
            const graphqlQuery = {
                query: `
                  mutation ResetRequest($email: String!) {
                    resetUserRequest(email: $email) {
                      __typename
                      ...on AuthData {
                        userId
                      }
                      ...on EmailNotFound {
                          message
                      }
                    }
                  }
                `,
                variables: {
                  email: email
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

                const graphqlResponse = resData.data.resetUserRequest

                if (graphqlResponse.__typename === 'EmailNotFound') {

                  setResetError('Email does not exists.')
                }

                if (graphqlResponse.__typename === 'AuthData') {
                  setEmail('')
                  setIsValid(false)
                  toggleModal()
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    return (
        <>
            <div className={`${divGridStyle} blue-round-shadow-effect-div shadow-blue-blur`}></div>
            <div className={`${divGridStyle} forgot-password-div shadow-blue-solid outline`}>
                <form
                  onSubmit={onSubmitReset}
                  className="forgot-password-form"
                >
                    <h2 className="forgot-password-title">Forgot the passsord?</h2>
                    <input
                        name="email"
                        placeholder="email"
                        value={email}
                        onChange={onChangeEmail}
                        onBlur={validationCheckup}
                    />
                    <div className="reset-error">{resetError}</div>
                    <button className="button-primary primary-blue white-text" type="submit">
                      Request reset
                    </button>
                </form>
            </div>   
            {modalViewForgotPassword}  
        </>
    )
}

