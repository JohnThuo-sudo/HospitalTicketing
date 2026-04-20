import React from 'react'

const RegisterConfirm = ({ formData }) => {
  return (
    <div>
        <h2 className='text-2xl font-bold mb-3'>Confirm Your Details</h2>
        <p className='text-lg'>Please review your details before submitting your registration. If everything looks correct, click the submit button to complete your registration for a ticket.</p>
        <div className='flex flex-col gap-2 mt-4'>
            <p><span className='font-semibold'>Full Name:</span> {formData.fullName}</p>
            <p><span className='font-semibold'>Date of Birth:</span> {formData.DOB}</p>
            <p><span className='font-semibold'>Phone Number:</span> {formData.phone}</p>
            <p><span className='font-semibold'>Gender:</span> {formData.gender}</p>
            <p><span className='font-semibold'>Payment Method:</span> {formData.paymentMethod}</p>
        </div>
    </div>
  )
}

export default RegisterConfirm