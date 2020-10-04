import React, { useContext } from 'react'
import { Context } from '../../Context'
import useModal from '../../customHooks/useModal/useModal'

export default function AutoLogoutMessage() {
    const { isModalOpen } = useContext(Context)
    const modalViewAutoLogout = useModal(isModalOpen, 'Auto logout after 1 hr. Please login again.', 'auto-logout')

    return (
        <>  
            {modalViewAutoLogout}
        </>
    )
}