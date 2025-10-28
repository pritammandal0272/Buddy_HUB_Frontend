import React, { useState } from "react";
import toast from "react-hot-toast";
import { Email } from "./SignUpInnerCom/Email";
import { Name } from "./SignUpInnerCom/Name";
import { DOB } from "./SignUpInnerCom/DOB";
import { Backend_Path } from "./Backend_Path";
import { Loader } from "./Loader";
import { useRef } from "react";
import { Password } from "./SignUpInnerCom/Password";
import axios from "axios";
import logo1 from "../../../assets/Images/logo1-removebg.png";
import { useNavigate } from "react-router-dom";
export const SignUpPageNew = ({
  isOpen,
  setisOpen,
  setSignUpInput,
  SignUpInput,
  LoaderState,
  setLoaderState,
}) => {
  const navigate = useNavigate();
  const [isOpenOTP, setisOpenOTP] = useState(false);
  const [SlideNextstate, setSlideNextstate] = useState(0);
  const [OTP_Counter, setOTP_Counter] = useState(false);
  const OTPref = useRef();
  const [VerifyEmail, setVerifyEmail] = useState(false);

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
          try {
            const FetchRoute = await fetch(
              `${Backend_Path()}/verify-otp${SignUpInput.email}`
            );
            const Response = await FetchRoute.json();
            console.log(Response);
            OTPref.current = Response.OTP;
            toast.success("OTP Send your Email");
            setOTP_Counter(true);
            setisOpenOTP(true);
            setLoaderState(false);
          } catch (err) {
            console.log(err);
            setLoaderState(false);
          }
        }
      } catch (err) {
        console.log(err);
        setLoaderState(false);
        toast.error("Server Error");
      }
    }
  };

  const SlideNext = async () => {
    setSlideNextstate((prev) => {
      if (prev == 110 * 3) {
        return 110 * 3;
      } else if (SignUpInput.name == "" || SignUpInput.lastname == "") {
        toast.error("Enter Name Properly");
        return prev;
      } else if (
        SlideNextstate == 110 &&
        (SignUpInput.day == "" ||
          SignUpInput.month == "" ||
          SignUpInput.year == "")
      ) {
        toast.error("Enter Valid Date");
        return prev;
      } else if (
        (!VerifyEmail && SlideNextstate == 110 * 2) ||
        (SlideNextstate == 110 * 2 &&
          (SignUpInput.email == "" ||
            !/^[a-z0-9_-]{5,20}@[a-z]{3,6}.{3,5}/.test(SignUpInput.email)))
      ) {
        toast.error("Email Not Varified Please Send OTP");
        return prev;
      } else {
        return prev + 110;
      }
    });

    if (SlideNextstate == 110 * 3) {
      if (
        SignUpInput.password != SignUpInput.conpassword ||
        SignUpInput.password == ""
      ) {
        toast.error("Confirm Password not Matched!!");
      } else {
        // console.log(SignUpInput);
        // =============Insert User Login Data on DataBase
        const InsertData = {
          name: SignUpInput.firstname + " " + SignUpInput.lastname,
          email: SignUpInput.email,
          password: SignUpInput.password,
          dob:
            SignUpInput.day + "/" + SignUpInput.month + "/" + SignUpInput.year,
        };
        setLoaderState(true);
        await axios.post(`${Backend_Path()}/login`, InsertData);
        const EmailFetch = await fetch(
          `${Backend_Path()}/find/loginuser${SignUpInput.email}`
        );
        const EmailResponse = await EmailFetch.json();
        localStorage.setItem("id", EmailResponse.id);
        setLoaderState(false);

        navigate("/feed");
        setSignUpInput({
          firstname: "",
          lastname: "",
          email: "",
          day: "",
          month: "",
          year: "",
          password: "",
          conpassword: "",
        });
        toast.success("Account Create Sucessfully");
        window.location.reload();
      }
    }
  };
  const BackPrev = () => {
    setSlideNextstate((prev) => prev - 110);
  };
  return (
    <>
      <div
        className={`border  rounded-xl overflow-hidden bg-[#f0f2f5] shadow-lg text-center ${
          isOpen == "sign-up" ? "block" : "hidden"
        }`}
      >
        <div
          className={`p-6 sm:p-8 relative overflow-hidden`}
        >
          <div className="flex justify-center">
            <img
              className="h-12"
              src={logo1}
              alt=""
            />
          </div>

          <p className="text-xl text-center bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent font-bold">
            Welcome Dear!
          </p>
          <div className="flex items-center justify-between mt-4 mb-6">
            <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

            <a
              href="#"
              className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
            >
              Create your account
            </a>

            <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
          </div>
          <div className="flex flex-col gap-2 relative">
            <div
              className="h-fit w-full flex transition-all duration-300 ease-in-out"
              style={{ marginLeft: `-${SlideNextstate}%` }}
            >
              {/* ==========Name=============== */}
              <Name SignUpInput={SignUpInput} setSignUpInput={setSignUpInput} />
              {/* ==========Date Of Birth=============== */}
              <DOB SignUpInput={SignUpInput} setSignUpInput={setSignUpInput} />
              {/* ==========Email=============== */}
              <Email
                isOpenOTP={isOpenOTP}
                SendOTP_Function={SendOTP_Function}
                SignUpInput={SignUpInput}
                setSignUpInput={setSignUpInput}
                OTPref={OTPref}
                VerifyEmail={VerifyEmail}
                setVerifyEmail={setVerifyEmail}
                setOTP_Counter = {setOTP_Counter}
                OTP_Counter = {OTP_Counter}
              />
              {/* ============Password============== */}

              <Password
                SignUpInput={SignUpInput}
                setSignUpInput={setSignUpInput}
              />
            </div>

            <div className="w-full h-fit flex items-center mt-4 justify-between">
              <button
                type="button"
                className={`text-gray-900 hover:text-white border  hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 ${
                  SlideNextstate > 0 ? "block" : "hidden"
                }`}
                onClick={() => BackPrev()}
              >
                Back
              </button>
              <button
                type="button"
                className={`text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${
                  SlideNextstate == 0 ? "ml-auto" : null
                }`}
                onClick={() => SlideNext()}
              >
                {SlideNextstate == 110 * 3 ? "Sign In" : "Continue"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

              <a
                href="#"
                className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
                onClick={() => setisOpen("sign-in")}
              >
                or sign in
              </a>

              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
            </div>
          </div>
        </div>
        <Loader LoaderState={LoaderState} />
      </div>
    </>
  );
};
