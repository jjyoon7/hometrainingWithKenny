import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../../Context'
import { required, validateLength, validateEmail } from '../../../utils/validators'
import useModal from '../../../customHooks/useModal/useModal'

import './Signup.css'

export default function Signup() {
    const { isMobileScreen, toggleModal, isModalOpen, setIsInSignupPage } = useContext(Context)
    
    const [ name, setName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ nameError, setNameError ] = useState('')
    const [ emailError, setEmailError ] = useState('')
    const [ passwordError, setPasswordError ] = useState('')

    const [ isValid, setIsValid ] = useState(false)

    const [ emailAlreadyExists, setEmailAlreadyExists ] = useState(false)

    const modalViewSignup = useModal(isModalOpen, 'Verification email sent.', 'sign-up')

    const onChangeName = e => setName(e.target.value)
    const onChangeEmail = e => setEmail(e.target.value)
    const onChangePassword = e => setPassword(e.target.value)

    useEffect(() => {
        setIsInSignupPage(true)
    }, [])

    const validationCheckup = (e) => {
        const nameValidated = required(name)
        const emailValidated = validateEmail(email)
        const passwordValidated = validateLength(password)

        if(e.target.name === 'name' && !nameValidated) {
            setNameError('Name cannot be empty.')
        }
        if(e.target.name === 'email' && !emailValidated) {
            setEmailError('Invalid email.')
        }
        if(e.target.name === 'password' && !passwordValidated) {
            setPasswordError('Not enough characters.')
        }
        if(nameValidated) {
            setNameError('')
        }
        if(emailValidated) {
            setEmailError('')
        }
        if(passwordValidated) {
            setPasswordError('')
        }
        if(nameValidated && emailValidated && passwordValidated) {
            setIsValid(true)
            return isValid
        } 
    }

    const validationCheckupWithoutUserInput = (e) => {
        // console.log('validate check up',e.target.name)

        const nameValidated = required(name)
        const emailValidated = validateEmail(email)
        const passwordValidated = validateLength(password)

        if(!nameValidated) {
            setNameError('Name cannot be empty.')
        }
        if(!emailValidated) {
            setEmailError('Invalid email.')
        }
        if(!passwordValidated) {
            setPasswordError('Not enough characters.')
        }
        if(nameValidated) {
            setNameError('')
        }
        if(emailValidated) {
            setEmailError('')
        }
        if(passwordValidated) {
            setPasswordError('')
        }
        if(nameValidated && emailValidated && passwordValidated) {
            setIsValid(true)
            return isValid
        } 
    }

    const onSubmitSignup = (e) => {
        // console.log('triggered', isValid)
        e.preventDefault()

        validationCheckupWithoutUserInput()

        if(isValid) {
            const graphqlQuery = {
                query: `
                    mutation CreateNewUser( $name: String!, $email: String!, $password: String! ){
                        createUser(userInput: {
                                               name: $name
                                               email: $email
                                               password: $password
                                            }) {
                                                __typename
                                                ...on User {
                                                    _id
                                                    name
                                                }
                                                ...on EmailInvalid {
                                                    message
                                                }
                                                ...on EmailExists {
                                                    message
                                                }
                                                ...on PasswordNotQualified {
                                                    message
                                                }
                                            }    
                    }
                `,
                variables: {
                    name,
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

                const graphqlResponse = resData.data.createUser

                if (graphqlResponse.__typename === 'EmailInvalid') {
                  setEmailError('Email invalid.')
                }
                if(graphqlResponse.__typename === 'EmailExists') {
                  setEmailError('Email exists.')
                  setEmailAlreadyExists(true)
                }
                if(graphqlResponse.__typename === 'PasswordNotQualified') {
                  setPasswordError('Password not qualified.')
                }
                if(graphqlResponse.__typename === 'User') {
                  //clear the name, email, password
                  setName('')
                  setEmail('')
                  setPassword('')
                  setIsValid(false)

                  //add modal to show sign up validation email has been sent
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
            <div className={ isMobileScreen ? "div manual blue-round-shadow-effect-div shadow-blue-blur mobile-row-first" : "div center-column blue-round-shadow-effect-div shadow-blue-blur mobile-row-first"}></div>
            <div className={ isMobileScreen ? "sign-up-form-div shadow-blue-solid manual mobile-row-first outline" : "sign-up-form-div shadow-blue-solid center-column mobile-row-first outline"}>
                <form
                    onSubmit={onSubmitSignup}
                    className="sign-up-form"
                >
                    <div className="sign-up-name">
                        <h3 className="">Name</h3>
                        <input
                            name="name"
                            placeholder="Kenny"
                            value={name}
                            onChange={onChangeName}
                            onBlur={validationCheckup}
                        />
                        <div className="sign-up-name-error">{nameError}</div>
                    </div>
                    <div className="sign-up-email">
                        <h3>Email</h3>
                        <input
                            name="email"
                            placeholder="email@mail.com"
                            value={email}
                            onChange={onChangeEmail}
                            onBlur={validationCheckup}
                        />
                        <div className="sign-up-email-error">{emailError}</div>
                    </div>
                    <div className="sign-up-password">
                        <h3>Password</h3>
                        <input
                            type="password"
                            name="password"
                            placeholder="least 6 characters"
                            value={password}
                            onChange={onChangePassword}
                            onBlur={validationCheckup}
                        />
                        <div className="sign-up-password-error">{passwordError}</div>
                    </div>
                    <input className="sign-up-button" type="submit" value="Sign up"/>
                </form>
                { emailAlreadyExists ? 
                    <div className="forgot-password-button">
                        <a href="http://localhost:3000/forgot-password">forgot the password?</a> 
                    </div>
                    : '' }
            </div>
            {modalViewSignup}
        </>    
    )
}