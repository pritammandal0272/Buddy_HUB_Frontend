import axios from "axios";
import React from "react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Backend_Path } from "./Backend_Path";
import { useNavigate } from "react-router-dom";
import { DOB } from "./SignUpInnerCom/DOB";
import { Password } from "./SignUpInnerCom/Password";
import { Loader } from "./Loader";
export const GoogleRedirectPasswordset = ({
  isOpen,
  setisOpen,
  GoogleData,
  setSignUpInput,
  SignUpInput,

  LoaderState,
  setLoaderState,
}) => {
  const [SlideNextstate, setSlideNextstate] = useState(0);

  const navigate = useNavigate();
  const [SignUpInputpass, setSignUpInputpass] = useState({
    password: "",
    conpassword: "",
  });
  const InputBoxValueFunction = (e) => {
    const { name, value } = e.target;
    setSignUpInputpass((prev) => ({ ...prev, [name]: value }));
  };
  // const CheckPassword = async () => {
  //   if (
  //     SignUpInputpass.password == SignUpInputpass.conpassword &&
  //     SignUpInput.password != ""
  //   ) {
  //     await axios.post(`${Backend_Path()}/update-google-blank-password`, {
  //       email: GoogleData.current,
  //       password: SignUpInput.password,
  //     });
  //     navigate("/feed");
  //     toast.success("Successfully Login !!");
  //   } else {
  //     toast.error("Password & Confirm Password Not Matched !!");
  //   }
  // };
  const SlideNext = async () => {
    if (SlideNextstate == 110) {
      if (
        SignUpInput.password != SignUpInput.conpassword ||
        SignUpInput.password == ""
      ) {
        toast.error("Confirm Password not Matched!!");
        return;
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
        toast.success("SignUp Sucessfully");
        window.location.reload();
      }
    }
    setSlideNextstate((prev) => {
      if (
        SignUpInput.day == "" ||
        SignUpInput.month == "" ||
        SignUpInput.year == ""
      ) {
        toast.error("Enter Valid Date");
        return prev;
      } else if (
        prev == 110 &&
        (SignUpInput.password != SignUpInput.conpassword ||
          SignUpInput.password == "")
      ) {
        toast.error("Confirm Password not Matched!!");
        return;
      } else {
        return prev + 110;
      }
    });
  };
  const BackPrev = () => {
    setSlideNextstate((prev) => prev - 110);
  };
  return (
    <>
      <div
        className={`border  rounded-xl overflow-hidden md:bg-[#f0f2f580] bg-white shadow-lg text-center ${
          isOpen == "google-pass" ? "block" : "hidden"
        }`}
      >
        {/* <Toaster /> */}
        <div
          className={`p-6 space-y-4 md:space-y-6 sm:p-8 relative overflow-hidden `}
        >
          <div className="flex justify-center">
            <img
              className="w-auto h-7 sm:h-8"
              src="https://merakiui.com/images/logo.svg"
              alt=""
            />
          </div>

          <p className="mt-3 text-xl text-center bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent font-bold">
            Welcome Dear!
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

            <a
              href="#"
              className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
            >
              Set Password
            </a>

            <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
          </div>
          <div className="flex flex-col gap-2 relative">
            <div
              className="h-fit w-full flex transition-all duration-300 ease-in-out"
              style={{ marginLeft: `-${SlideNextstate}%` }}
            >
              <DOB SignUpInput={SignUpInput} setSignUpInput={setSignUpInput} />
              <Password
                SignUpInput={SignUpInput}
                setSignUpInput={setSignUpInput}
              />
            </div>
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
              {SlideNextstate == 110 ? "Login" : "Continue"}
            </button>
          </div>
        </div>
        <Loader LoaderState={LoaderState} />
      </div>
    </>
  );
};
