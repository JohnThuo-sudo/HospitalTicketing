import React, { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  const { label, placeholder, value, onChange, type = "text" } = props;
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-2xl" htmlFor={label}>
        {label}
      </label>
      <input
        ref={ref}
        className="border focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 pl-1"
        type={type}
        placeholder={placeholder}
        id={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
});

Input.displayName = "Input";
export default Input;
