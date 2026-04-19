import React from 'react'

const Input = (props) => {
    const { label, placeholder, value, onChange, type = 'text' } = props;
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-2xl" htmlFor={label}>
        {label}
      </label>
      <input
        className="border focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 pl-1"
        type={type}
        placeholder={placeholder}
        id={label}
        value={value}
        onChange={onChange}
      />

    </div>
  );
}

export default Input