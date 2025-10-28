import React, { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { Backend_Path } from "./Backend_Path";
import logo1 from "../../../assets/Images/logo1-removebg.png";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
export const SignIn = ({ isOpen, setisOpen }) => {
  const navigate = useNavigate();
  const [LoaderState, setLoaderState] = useState(false);
  const [ShowPassword, setShowPassword] = useState(false);
  const [InputBoxValue, setInputBoxValue] = useState({
    email: "",
    password: "",
  });
  const InputBoxValueFunction = (e) => {
    const { name, value } = e.target;
    setInputBoxValue((prev) => ({ ...prev, [name]: value }));
  };
  const SignInFunction = () => {
    setisOpen("sign-up");
  };
  const SignInFunctionCheckEmail = async () => {
    try {
      setLoaderState(true);
      const EmailFetch = await fetch(
        `${Backend_Path()}/find/loginuser${InputBoxValue.email}`
      );
      const EmailResponse = await EmailFetch.json();
      if (
        EmailResponse.email == InputBoxValue.email &&
        EmailResponse.password == InputBoxValue.password
      ) {
        localStorage.setItem("id", EmailResponse.id);
        console.log(EmailResponse);

        toast.success("Login Sucessfully");
        navigate("/feed");
        setLoaderState(false);
        window.location.reload();
      } else {
        toast.error("Invalid Email and Password");
        setLoaderState(false);
      }
    } catch (err) {
      setLoaderState(false);
      toast.error("Server Error");
      console.log(err);
    }
  };
  const GoogleLogin = () => {
    window.open(`${Backend_Path()}/auth/google`);
  };
  return (
    <>
      <div
        className={` border  rounded-xl bg-[#f0f2f5] shadow-lg text-center px-8 ${
          isOpen === "sign-in" ? "block" : "hidden"
        }`}
      >
        <div className="w-full py-8">
          <div className="flex justify-center">
            <img className="w-auto h-12" src={logo1} alt="" />
          </div>

          <p className=" text-xl text-center bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent font-bold">
            Welcome Dear!
          </p>

          <a
            href="#"
            className="flex p-2 gap-2 items-center justify-center mt-4 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-300"
            onClick={() => GoogleLogin()}
          >
            <div className="text-2xl">
              <FcGoogle />
            </div>

            <span className="font-bold text-center text-gray-600">
              Sign Up with Google
            </span>
          </a>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

            <a
              href="#"
              className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
            >
              or login with email
            </a>

            <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
          </div>

          <div className="mt-4">
            <div className="flex">
              <label
                className="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                htmlFor="LoggingEmailAddress"
              >
                Email Address
              </label>
            </div>
            <input
              id="LoggingEmailAddress"
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
              type="email"
              placeholder="Enter your email here"
              name="email"
              value={InputBoxValue.email}
              onChange={(e) => InputBoxValueFunction(e)}
            />
          </div>

          <div className="mt-4">
            <div className="flex justify-between">
              <label
                className="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                htmlFor="loggingPassword"
              >
                Password
              </label>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Forget Password?
              </a>
            </div>
            <div className="flex items-center  bg-white border rounded-md  overflow-hidden pr-2 shadow-sm justify-end">
              <input
                id="loggingPassword"
                className="block w-full px-4 py-2 text-gray-700 focus:outline-none"
                type={!ShowPassword ? "password" : "text"}
                name="password"
                placeholder="Enter password here.."
                value={InputBoxValue.password}
                onChange={(e) => InputBoxValueFunction(e)}
              />
              <div
                className="text-gray-500 cursor-pointer text-2xl"
                onClick={() => setShowPassword((prev) => (prev ? false : true))}
              >
                {ShowPassword ? (
                  <IoEye className="text-blue-500" />
                ) : (
                  <IoMdEyeOff />
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none"
              onClick={() => SignInFunctionCheckEmail()}
            >
              <svg
                aria-hidden="true"
                role="status"
                class={`text-red-500 transition-all duration-200 ease-in-out animate-spin  h-4 w-4 ${
                  LoaderState
                    ? " opacity-100  h-4 w-4 pointer-events-auto"
                    : "opacity-0 h-0 w-0 pointer-events-none"
                }`}
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>{" "}
              Sign In
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

            <a
              href="#"
              className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
              onClick={() => SignInFunction()}
            >
              or sign up
            </a>

            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </>
  );
};
