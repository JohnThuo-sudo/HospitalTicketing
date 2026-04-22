import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import Input from "../components/Input";
import { Link } from "react-router-dom";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegister, setRegister] = useState(false);
  const [error, setError] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Animations
  const container = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn",
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  const componentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: "easeOut" }, // ❗ removed delay (causes lag on toggle)
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.35, ease: "easeIn" },
    },
  };

  // ✅ Fixed error handler
  const handleError = (message, ref) => {
    setError(message);
    if (ref?.current) {
      ref.current.focus();
    }
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  // ❗ Do NOT validate on every keystroke — just update state
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  // ✅ Central validation (correct approach)
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!email) {
      handleError("Email is required", emailRef);
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      handleError("Email format is incorrect", emailRef);
      return false;
    }

    if (!passwordRegex.test(password.trim())) {
      handleError("Weak Password");
      return false;
    }

    if (password.length < 6) {
      handleError("Password must be at least 6 characters", passwordRef);
      return false;
    }

    if (isRegister && password !== confirmPassword) {
      handleError("Passwords do not match", confirmPasswordRef);
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (isRegister) {
      console.log("Register:", { email, password });
    } else {
      console.log("Login:", { email, password });
    }
  };

  return (
    <motion.main
      className="flex justify-center items-center-safe h-screen bg-gray-50"
      variants={container}
      initial="initial"
      animate="animate"
    >
      <div className="bg-green-100/50 w-[66%] md:w-[50%] lg:w-[40%] p-8 rounded-sm backdrop-blur-3xl flex flex-col gap-6 pl-18">
        {/* Toggle */}
        <div className="flex gap-2 items-baseline">
          <div
            className={
              !isRegister
                ? "font-bold text-4xl"
                : "cursor-pointer animate-bounce"
            }
            onClick={() => setRegister(false)}
          >
            Login
          </div>

          <span className="w-px h-8 bg-gray-500"></span>

          <div
            className={
              isRegister
                ? "font-bold text-4xl"
                : "cursor-pointer animate-bounce"
            }
            onClick={() => setRegister(true)}
          >
            Register
          </div>
        </div>

        {/* Animated Form Switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isRegister ? "register" : "login"} // ❗ VERY IMPORTANT for animation switch
            variants={componentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {error && <span className="text-red-500">{error}</span>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                ref={emailRef}
                className="w-[90%]"
                label="Email"
                placeholder="abc123@email.com"
                value={email}
                onChange={handleEmailChange}
                variants={item}
              />

              <Input
                ref={passwordRef}
                className="w-[90%]"
                label="Password"
                placeholder="*******************"
                value={password}
                onChange={handlePasswordChange}
                type="password"
                variants={item}
              />

            <Link to="/staff/triage/:id">
              {isRegister && (
                <Input
                  ref={confirmPasswordRef}
                  className="w-[90%]"
                  label="Confirm Password"
                  placeholder="*******************"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  type="password"
                  variants={item}
                />
              )}

              <motion.button
                type="submit"
                className="mr-auto bg-blue-500 w-[90%] h-10 rounded-md font-semibold shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition-colors duration-300 cursor-pointer text-xl mt-6"
                variants={item}
              >
                {isRegister ? "Register" : "Login"}
              </motion.button>            
            </Link>

            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.main>
  );
};

export default StaffLogin;
