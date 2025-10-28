import React, { useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import VarifyImg from "../../../../assets/Images/varified.png";
import TikhSign from "../../../../assets/Images/TikhSign.png";
import { Timeing } from "../../SettingsComponents/Timeing";
export const Email = ({
  isOpenOTP,
  SendOTP_Function,
  SignUpInput,
  setSignUpInput,
  OTPref,
  VerifyEmail,
  setVerifyEmail,
  OTP_Counter,
  setOTP_Counter,
}) => {
  const navigate = useNavigate();
  const [LoaderState, setLoaderState] = useState(false);
  const [EmailValue, setEmailValue] = useState({ email: "" });
  const Box1 = useRef();
  const Box2 = useRef();
  const Box3 = useRef();
  const Box4 = useRef();
  const [inputOTP, setinputOTP] = useState({
    first: "",
    second: "",
    thard: "",
    fourth: "",
  });
  const InputBoxValueFunction = async (e) => {
    const { name, value } = e.target;
    setSignUpInput((prev) => ({ ...prev, [name]: value }));
    setEmailValue((prev) => ({ ...prev, email: value }));
  };
  const OTPInputBoxValue = (e, nextBoxFocus) => {
    const { name, value } = e.target;
    setinputOTP((prev) => ({ ...prev, [name]: value }));
    if (value && nextBoxFocus) {
      nextBoxFocus.current.focus();
    }
  };
  const VarifyEmail = () => {
    const OTP =
      inputOTP.first + inputOTP.second + inputOTP.thard + inputOTP.fourth;
    // console.log(SignUpInput);

    if (OTP == OTPref.current) {
      // navigate("/feed");
      setVerifyEmail(true);
    } else {
      toast.error("OTP not Matched");
    }
  };
  const FocusPrevBox = (e, prev) => {
    if (e.key === "Backspace") {
      const name = e.target.name;
      setinputOTP((prevInput) => ({ ...prevInput, [name]: "" }));

      if (prev !== null) {
        prev.current.focus();
      }
    }
  };

  return (
    <>
      <div className="shrink-0 w-full mr-9 ">
        <div className="flex">
          <label
            className="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
            htmlFor="name"
          >
            Enter Email
          </label>
        </div>
        <div className="h-fit flex gap-2">
          <input
            id="email"
            name="email"
            className={`block w-full px-4 py-2 text-gray-700 border rounded-md shadow-sm bg-white`}
            type="text"
            placeholder="Enter your email here"
            value={SignUpInput.email}
            disabled={VerifyEmail}
            onChange={(e) => InputBoxValueFunction(e)}
          />
          <button
            type="button"
            className={`text-white transition-all duration-300 ease-in-out bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm p-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
              VerifyEmail || OTP_Counter
                ? "opacity-0 w-0 h-0 pointer-events-none"
                : "opacity-100 pointer-events-auto h-fit w-fit"
            }`}
            onClick={() => SendOTP_Function()}
          >
            Send
          </button>
          <img
            src={TikhSign}
            className={`h-[2.5em] ${VerifyEmail ? "block" : "hidden"}`}
            alt=""
          />
        </div>

        <div
          className={`w-full h-fit flex font-semibold flex-col items-center justify-center py-2 ${
            VerifyEmail ? "flex" : "hidden"
          }`}
        >
          <img src={VarifyImg} className="h-[5em]" alt="" />
          <p className="text-blue-600">Varified</p>
        </div>

        <div
          className={`w-full flex flex-col mt-4 ${
            isOpenOTP ? "block" : "hidden"
          } ${VerifyEmail ? "hidden" : null}`}
        >
          <div className="flex gap-2">
            <input
              maxLength={1}
              type="text"
              name="first"
              value={inputOTP.first}
              ref={Box1}
              onChange={(e) => OTPInputBoxValue(e, Box2)}
              onKeyDown={(e) => FocusPrevBox(e, null)}
              className="w-10 h-10 font-medium text-[#365CCE] border border-[#365CCE] rounded-md text-center text-2xl"
            />
            <input
              maxLength={1}
              type="text"
              name="second"
              value={inputOTP.second}
              ref={Box2}
              onChange={(e) => OTPInputBoxValue(e, Box3)}
              onKeyDown={(e) => FocusPrevBox(e, Box1)}
              className="w-10 h-10 font-medium text-[#365CCE] border border-[#365CCE] rounded-md text-center text-2xl"
            />
            <input
              maxLength={1}
              type="text"
              name="thard"
              value={inputOTP.thard}
              ref={Box3}
              onChange={(e) => OTPInputBoxValue(e, Box4)}
              onKeyDown={(e) => FocusPrevBox(e, Box2)}
              className="w-10 h-10 font-medium text-[#365CCE] border border-[#365CCE] rounded-md text-center text-2xl"
            />
            <input
              maxLength={1}
              type="text"
              name="fourth"
              value={inputOTP.fourth}
              ref={Box4}
              onChange={(e) => OTPInputBoxValue(e, null)}
              onKeyDown={(e) => FocusPrevBox(e, Box3)}
              className="w-10 h-10 font-medium text-[#365CCE] border border-[#365CCE] rounded-md text-center text-2xl"
            />
          </div>

          <Timeing
            OTP_Counter={OTP_Counter}
            setOTP_Counter={setOTP_Counter}
            LoaderState={LoaderState}
            setLoaderState={setLoaderState}
            EmailValue={EmailValue}
            OTPref={OTPref}
          />
          <button
            className="px-2 w-fit py-2 mt-6 text-sm font-bold tracking-wider text-white capitalize transition-colors duration-300 transform bg-orange-600 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring focus:ring-orange-300 focus:ring-opacity-80 float-left"
            onClick={() => VarifyEmail()}
          >
            Verify email
          </button>
        </div>
      </div>
    </>
  );
};
