import React, { useEffect, useContext } from 'react'
import { Context } from '../../Context'
import { createPortal } from 'react-dom'
import { useHistory } from 'react-router-dom'
import './useModal.css'

const modalRoot = document.getElementById("modal-root")

export default function Modal(isOpen, message) {
  const { toggleModal, setIsAutoLogoutTriggered, isAutoLogoutTriggered } = useContext(Context)
  const el = document.createElement("div")

  const history = useHistory()

  const scrollHeight = document.documentElement.scrollHeight

  // console.log('scrollHeight',scrollHeight)

  useEffect(() => {
    // append to root when the children of Modal are mounted
    modalRoot.appendChild(el)

    // do a cleanup
    return () => {
      modalRoot.removeChild(el)
    }
  }, [el])

  const onClickModalButton = () => {
    if(isAutoLogoutTriggered) {
      setIsAutoLogoutTriggered(false)
    }
      history.push('/')
      toggleModal()
  }

  return (
    isOpen &&
    createPortal(
      // child element
      <div className="modal-background-div" style={{height: scrollHeight}}>
        <div className="modal-message-div">
            <h2 className="modal-message">{message}</h2>
            <button className="modal-button button-primary primary-blue white-text" onClick={onClickModalButton}>close</button>
        </div>
      </div>,
      // target container
      el
    )
  )
}