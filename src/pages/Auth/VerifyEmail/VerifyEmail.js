import React, { useState, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { Context } from '../../../Context'
import './VerifyEmail.css'

import useModal from '../../../customHooks/useModal/useModal'

export default function VerifyEmail() {
    const { isMobileScreen, setIsInVerifyEmailPage, toggleModal, isModalOpen } = useContext(Context)
    const [ verificationError, setVerificationError ] = useState('')
    const [ divGridStyle, setDivGridStyle ] = useState('')

    const modalViewVerifyEmail = useModal(isModalOpen, 'Account activated.')

    const location = useLocation()

    useEffect(() => {
      setIsInVerifyEmailPage(true)
    }, [])

    useEffect(() => {
      if(isMobileScreen) {
        setDivGridStyle('manual')
      } else {
        setDivGridStyle('center-column')
      }
    }, [ isMobileScreen ])

    const verifyEmailHandler = (event) => {
      event.preventDefault()

      const verificationToken = location.pathname.split('/confirmation/')[1]

      // console.log('verificationToken', verificationToken)

      const graphqlQuery = {
        query: `
          query VerifyUserEmail($verificationToken: String!){
            verifyEmail(verificationToken: $verificationToken) {
              __typename
              ...on User {
                _id
                isVerified
              }
              ...on EmailVerificationFailed {
                message
              }
            }
          }
        `,
        variables: {
          verificationToken: verificationToken
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

          const graphqlResponse = resData.data.verifyEmail

          if (graphqlResponse.__typename === 'EmailVerificationFailed') {
              setVerificationError('Email verification failed.')
          }

          if (graphqlResponse.__typename === 'User') {
              toggleModal()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    return (
      <>
        <div className={`${divGridStyle} blue-round-shadow-effect-div shadow-blue-blur`}></div>
        <div className={`${divGridStyle} verify-email-div shadow-blue-solid outline`}>
            <form className="verify-form" onSubmit={verifyEmailHandler}>
              <h2>Verify your email for activation</h2>
              <button className="verify-button button-primary primary-blue white-text" type="submit">
                        Verify email
              </button>
              {verificationError}
            </form>
        </div>
        {modalViewVerifyEmail}
      </>
    )
}

