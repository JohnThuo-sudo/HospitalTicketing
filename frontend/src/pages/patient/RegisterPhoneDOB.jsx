import React, { useState } from 'react'
import Input from '../../components/Input';

const RegisterPhoneDOB = () => {
      const [phone, setPhone] = useState('');
      const [DOB, setDOB] = useState('');

  return (
    <div className='flex flex-col gap-5 w-[70%] mx-auto'>
        <h2>Fill Contact Details</h2>
      <Input
        label="Phone Number"
        placeholder="0700000000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        Required
      />

      <Input
        label="Date of Birth"
        type="date"
        value={DOB}
        onChange={(e) => setDOB(e.target.value)}
        required
      />
    </div>
  );
}

export default RegisterPhoneDOB