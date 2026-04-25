import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { loginUser, registerStaff } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import LoadingSpinner from "../components/LoadingSpinner";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegister, setRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();

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
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.35, ease: "easeIn" },
    },
  };

  const handleError = (message, ref) => {
    showError(message);
    if (ref?.current) {
      ref.current.focus();
    }
    setTimeout(() => {
      // Error notification will auto-dismiss
    }, 3000);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

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
      handleError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      );
      return false;
    }

    if (isRegister && password !== confirmPassword) {
      handleError("Passwords do not match", confirmPasswordRef);
      return false;
    }

    return true;
  };

  const routeByRole = (role) => {
    if (role === "manager") {
      return "/hospital/admin";
    }
    if (role === "triage") {
      return "/staff/triage";
    }
    if (role === "doctor") {
      return "/staff/doctor";
    }
    if (role === "pharmacist") {
      return "/staff/pharmacy";
    }
    return "/staff";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      if (isRegister) {
        const data = await registerStaff({ email, password });
        login(data);
        showSuccess("Registration successful! Welcome to the system.");
        navigate(routeByRole(data.user.role));
      } else {
        const data = await loginUser({ email, password });
        login(data);
        showSuccess(`Welcome back, ${data.user.full_name}!`);
        navigate(routeByRole(data.user.role));
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Authentication failed";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
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

        <AnimatePresence mode="wait">
          <motion.div
            key={isRegister ? "register" : "login"}
            variants={componentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
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

              {isRegister && (
                <>
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
                  <div>
                    <p className="text-red-700">
                      Your email must be registered by admin before you can
                      complete registration.
                    </p>
                  </div>
                </>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                className={`mr-auto bg-blue-500 w-[90%] h-10 rounded-md font-semibold shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition-colors duration-300 cursor-pointer text-xl mt-6 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                variants={item}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">
                      {isRegister ? "Registering..." : "Logging in..."}
                    </span>
                  </div>
                ) : isRegister ? (
                  "Register"
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.main>
  );
};

export default StaffLogin;
