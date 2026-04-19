import React from 'react'

const RegisterConfirm = () => {
  return (
    <div>
        <h2 className='text-2xl font-bold mb-3'>Confirm Your Details</h2>
        <p className='text-lg'>Please review your details before submitting your registration. If everything looks correct, click the submit button to complete your registration for a ticket.</p>
        <div className='flex flex-col gap-2 mt-4'>
            <p><span className='font-semibold'>Full Name:</span> John Doe</p>
            <p><span className='font-semibold'>Date of Birth:</span> 01/01/1990</p>
            <p><span className='font-semibold'>Phone Number:</span> +1234567890</p>
            <p><span className='font-semibold'>Gender:</span> Male</p>
            <p><span className='font-semibold'>Payment Method:</span> M-Pesa</p>
        </div>
    </div>
  )
}

export default RegisterConfirm