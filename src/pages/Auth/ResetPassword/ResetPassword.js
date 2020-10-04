import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { validateLength } from '../../../utils/validators'
import { Context } from '../../../Context'

import useModal from '../../../customHooks/useModal/useModal'

import './ResetPassword.css'

export default function ResetPassword() {
  const { setIsInResetPasswordPage, isMobileScreen, isModalOpen, toggleModal } = useContext(Context)
  const { refreshToken } = useParams()

  const [ newPassword, setNewPassword ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState('')
  const [ isValid, setIsValid ] = useState(false)
  const [ divGridStyle, setDivGridStyle ] = useState('')

  const modalViewResetPassword = useModal(isModalOpen, 'Reset confirmation email has been sent.', 'reset-password')

  useEffect(() => {
    setIsInResetPasswordPage(true)
    // console.log('reset component called')
  }, [])

  useEffect(() => {
    if(isMobileScreen) {
      setDivGridStyle('manual')
    } else {
      setDivGridStyle('center-column')
    }
  }, [ isMobileScreen ])

  const onChangePassword = (e) => setNewPassword(e.target.value)

  const validatePassword = () => {
    
      const passwordValidated = validateLength(newPassword)
      // console.log('passwordValidated',passwordValidated)
      if(!passwordValidated) {
        setErrorMessage('Not enough characters.')
      } else if(passwordValidated) {
        return setIsValid(true)
      }
  }

  const updatePasswordHandler = (e) => {
    e.preventDefault()

    validatePassword()

    if(isValid) {
      setErrorMessage('')

      const resetPasswordToken = refreshToken
  
      // console.log('resetPasswordToken', resetPasswordToken)
      // console.log('new password value', newPassword)
  
      const graphqlQuery = {
        query: `
            mutation UpdateNewPassword( $newPassword: String!, $resetPasswordToken: String! ){
              updateUserPassword(newPassword: $newPassword, resetPasswordToken: $resetPasswordToken) {
                                      __typename
                                      ...on User {
                                        _id
                                      }
                                      ...on EmailInvalid {
                                        message
                                      }
                                      ...on PasswordNotQualified {
                                        message
                                      }
                                    }
            }
        `,
        variables: {
          newPassword: newPassword,
          resetPasswordToken: resetPasswordToken
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
  
          const graphqlResponse = resData.data.updateUserPassword
  
          if (graphqlResponse.__typename === 'EmailInvalid') {
            setErrorMessage('Email invalid.')
          }
          if (graphqlResponse.__typename === 'PasswordNotQualified') {
            setErrorMessage('Password not qualified.')
          }
          if (graphqlResponse.__typename === 'User') {
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
        <div className={`${divGridStyle} reset-password-div shadow-blue-solid outline`}>
          <form className="reset-password-form" onSubmit={updatePasswordHandler}>
              <h2 className="reset-password-title">Reset the password</h2>
              <input type="password" 
                     value={newPassword}
                     placeholder="least 6 characters"
                     onChange={onChangePassword}    
                     onBlur={validatePassword}
              />
              <div className="reset-password-error">{errorMessage}</div>
              <button className="reset-password-button button-primary primary-blue white-text" design="raised" type="submit">
                Reset
              </button>
          </form>
        </div>
        {modalViewResetPassword}
    </>
  )
}
