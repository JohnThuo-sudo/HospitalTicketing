import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import Input from '../components/Input'

const StaffLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setRegister] = useState(false);

  const container = {
    initial : {
        opacity: 0,
        y: 20,        
    },
    animate : {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeIn",
            staggerChildren: 0.15
        }
    }
  }

  const item = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeInOut",
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.4,
            ease: "easeIn"
        }
    }
  }

    const handlePassword = () => {}
    const handleEmail = () => {}

  return (
    <AnimatePresence mode="wait">
      <motion.main
      className="flex justify-center items-center-safe h-screen bg-gray-50"
      variants={container}
      initial="initial"
      animate="animate"
      >
        <div className="bg-green-100/50 w-[66%] md:w-[50%] lg:w-[40%] p-8 rounded-sm backdrop-blur-3xl flex flex-col gap-6 pl-18 ">
          <div className="flex gap-2 items-baseline">
            <div
            className={!isRegister ? "font-bold text-4xl" : " cursor-pointer animate-bounce"}
            onClick={() => setRegister(false)}
            >
              Login
            </div>
            <span className="w-px h-8 bottom-10 bg-gray-500 "></span>
            <div
            className={isRegister ? " font-bold text-4xl" : " cursor-pointer animate-bounce"}
            onClick={() => setRegister(true)}
            >Register</div>
          </div>
          {!isRegister ?
          <div>
            <form className=" flex flex-col gap-4">
              <Input
                className="w-[90%]"
                label="Email"
                placeholder="abc123@email.com"
                value={email}
                onChange={handleEmail}
                variants={item}
              />
              <Input
                className="w-[90%]"
                label="Password"
                placeholder="*******************"
                value={password}
                onChange={handlePassword}
                variants={item}
                // ref
                // variants
              />
            </form>
          </div> :
          <div>
            {" "}
            <form className=" flex flex-col gap-4">
              <Input
                className="w-[90%]"
                label="Email"
                placeholder="abc123@email.com"
                value={email}
                onChange={handleEmail}
              />
              <Input
                className="w-[90%]"
                label="Password"
                placeholder="*******************"
                value={password}
                onChange={handlePassword}
                // ref
                // variants
              />
              <Input
                className="w-[90%]"
                label="Confirm Password"
                placeholder="*******************"
                value={password}
                onChange={handlePassword}
                // ref
                // variants
              />
            </form>{" "}
          </div>               
          }

          <motion.button
          className="mr-auto bg-blue-500 w-[90%] h-10 rounded-md font-semibold shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition-colors duration-300 cursor-pointer text-xl mt-6"
          variants={item}
          >
            {isRegister ? "Register" : "Login"}
          </motion.button>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}

export default StaffLogin