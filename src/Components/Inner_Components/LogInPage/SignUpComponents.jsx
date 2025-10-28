import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "./Loader";
import { Backend_Path } from "./Backend_Path";
import axios from "axios";
export const SignUp = ({ isOpen, setisOpen, PassWordDiv_Show, OTP }) => {
  const [LoaderState, setLoaderState] = useState(false);
  const [SignUpInput, setSignUpInput] = useState({
    name: "",
    email: "",
    password: "",
    conpassword: "",
  });
  const InputBoxValueFunction = async (e) => {
    const { name, value } = e.target;
    setSignUpInput((prev) => ({ ...prev, [name]: value }));
  };
  const SendOTP_Function = async () => {
    if (SignUpInput.name == "") {
      toast.error("Please Enter Name");
      return;
    } else if (!/^[a-z0-9_-]{5,20}@[a-z]{3,6}.{3,5}/.test(SignUpInput.email)) {
      toast.error("Enter Valid Email");
      return;
    } else {
      // ===========OTP Send Part===============
      setLoaderState(true);
      try {
        // ============Check Email alredy Exits or Not============
        const EmailFetch = await fetch(
          `${Backend_Path()}/find/loginuser${SignUpInput.email}`
        );
        const EmailResponse = await EmailFetch.json();
        if (EmailResponse.email == SignUpInput.email) {
          setLoaderState(false);
          toast.error("Email id allready exits!!");
          return;
        } else {
          const FetchRoute = await fetch(
            `${Backend_Path()}/verify-otp${SignUpInput.email}`
          );
          const Response = await FetchRoute.json();
          console.log(Response);
          OTP.current = Response.OTP;
          toast.success("OTP Send your Email");
          setLoaderState(false);
          setisOpen("OTP");
        }
      } catch (err) {
        console.log(err);
        toast.error("Server Error");
      }
    }
  };

  const SubmitSignUpFrom = async (e) => {
    event.preventDefault();
    if (SignUpInput.name == "") {
      toast.error("Please Enter Name");
      return;
    } else if (!/^[a-z0-9_-]{5,20}@[a-z]{3,6}.{3,5}/.test(SignUpInput.email)) {
      toast.error("Enter Valid Email");
      return;
    } else {
      // console.log(PassWordDiv_Show.current);

      if (PassWordDiv_Show.current) {
        if (
          SignUpInput.password == "" ||
          SignUpInput.password != SignUpInput.conpassword
        ) {
          toast.error("Password and Confirm Password Not Matched");
        } else {
          // ===========UserAccount Insert On DataBase=================
          const InsertData = {
            name: SignUpInput.name,
            email: SignUpInput.email,
            password: SignUpInput.password,
          };
          await axios.post(`${Backend_Path()}/login`, InsertData);
          toast.success("Account Create Sucessfully");
          setisOpen("sign-in");
          // console.log(SignUpInput);
          PassWordDiv_Show.current = false;
          setSignUpInput({
            name: "",
            email: "",
            password: "",
            conpassword: "",
          });
        }
      } else {
        toast.error("Email is Not Varified!");
        return;
      }
    }
  };

  return (
    <>
      <>
        <div
          className={`border  rounded-xl overflow-hidden bg-[#f0f2f5] shadow-lg text-center ${
            isOpen == "sign-up" ? "block" : "hidden"
          }`}
        >
          <div
            class={`p-6 space-y-4 md:space-y-6 sm:p-8 relative overflow-hidden `}
          >
            <div class="flex justify-center">
              <img
                class="w-auto h-7 sm:h-8"
                src="https://merakiui.com/images/logo.svg"
                alt=""
              />
            </div>

            <p class="mt-3 text-xl text-center bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent font-bold">
              Welcome Dear!
            </p>
            <div class="flex items-center justify-between mt-4">
              <span class="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

              <a
                href="#"
                class="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
              >
                Create your account
              </a>

              <span class="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
            </div>
            <form
              class="flex flex-col gap-2"
              onSubmit={(e) => SubmitSignUpFrom(e)}
            >
              <div>
                <div className="flex">
                  <label
                    class="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                    for="name"
                  >
                    Your Name
                  </label>
                </div>
                <input
                  id="name"
                  name="name"
                  class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
                  type="text"
                  placeholder="Enter your Name here"
                  value={SignUpInput.name}
                  onChange={(e) => InputBoxValueFunction(e)}
                />
              </div>
              <div>
                <div className="flex">
                  <label
                    class="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                    for="email"
                  >
                    Your Email
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    id="email"
                    name="email"
                    class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
                    type="text"
                    placeholder="Enter your email here"
                    value={SignUpInput.email}
                    onChange={(e) => InputBoxValueFunction(e)}
                  />
                  <button
                    type="button"
                    class={`text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm p-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 `}
                    onClick={() => SendOTP_Function()}
                  >
                    Send
                  </button>
                </div>
              </div>
              <div
                className={`flex flex-col gap-2 ${
                  PassWordDiv_Show.current ? "flex" : "hidden"
                }`}
              >
                <div>
                  <div className="flex">
                    <label
                      class="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                      for="password"
                    >
                      Password
                    </label>
                  </div>
                  <input
                    id="password"
                    name="password"
                    class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
                    type="password"
                    placeholder="••••••••"
                    value={SignUpInput.password}
                    onChange={(e) => InputBoxValueFunction(e)}
                  />
                </div>
                <div>
                  <div className="flex">
                    <label
                      class="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                      for="conpassword"
                    >
                      Confirm Password
                    </label>
                  </div>
                  <input
                    id="conpassword"
                    name="conpassword"
                    class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
                    type="password"
                    placeholder="••••••••"
                    value={SignUpInput.conpassword}
                    onChange={(e) => InputBoxValueFunction(e)}
                  />
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="terms" class="font-light text-gray-500">
                    I accept the{" "}
                    <a
                      class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-md dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full mt-4"
              >
                Create an account
              </button>
              <div class="flex items-center justify-between mt-4">
                <span class="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

                <a
                  href="#"
                  class="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
                  onClick={() => setisOpen("sign-in")}
                >
                  or sign in
                </a>

                <span class="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              </div>
            </form>
          </div>
          <Loader LoaderState={LoaderState} />
        </div>
      </>
    </>
  );
};
