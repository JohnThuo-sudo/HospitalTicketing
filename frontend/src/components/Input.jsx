import { motion } from "framer-motion";
import React, { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  const {
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    variants,
    className
  } = props;

  return (
    <motion.div
      className="flex flex-col gap-2"
      variants={variants}
      initial={variants ? "initial" : undefined}
      animate={variants ? "animate" : undefined}
      exit={variants ? "exit" : undefined}
    >
      <label className="font-semibold text-2xl" htmlFor={label}>
        {label}
      </label>
      <input
        ref={ref}
        className={"border focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 pl-1 " + className}
        type={type}
        placeholder={placeholder}
        id={label}
        value={value}
        onChange={onChange}
      />
    </motion.div>
  );
});

Input.displayName = "Input";
export default Input;
