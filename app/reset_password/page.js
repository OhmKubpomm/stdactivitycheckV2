import Resetpassword from '@/components/auth/Resetpassword'
import React from 'react'


const ResetPasswordPage = ({ searchParams: { token } }) => {
    return (
        <div>
            <Resetpassword token={token} />
        </div>
    )
}

export default ResetPasswordPage
