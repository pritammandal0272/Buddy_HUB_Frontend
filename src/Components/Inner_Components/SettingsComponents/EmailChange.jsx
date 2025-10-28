import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Backend_Path } from "../LogInPage/Backend_Path";
import toast from "react-hot-toast";
import { Loader } from "../../Loader/Loader";
import { Timeing } from "./Timeing";
export const EmailChange = ({ User_information, setUser_information }) => {
  const [isOpen, setisOpen] = useState(false);
  const [isOpenOTP, setisOpenOTP] = useState(false);
  const [LoaderState, setLoaderState] = useState(false);
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const [OTP_Counter, setOTP_Counter] = useState(false);
  const OTPref = useRef();
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
  };
  const OTPInputBoxValue = (e, nextBoxFocus) => {
    const { name, value } = e.target;
    setinputOTP((prev) => ({ ...prev, [name]: value }));
    if (value && nextBoxFocus) {
      nextBoxFocus.current.focus();
    }
  };
  const EmailValueFunction = (e) => {
    setEmailValue((prev) => ({ ...prev, email: e.target.value }));
  };
  const SendOTP = async () => {
    if (!/^[a-z0-9_-]{5,20}@[a-z]{3,6}.{3,5}/.test(EmailValue.email)) {
      toast.error("Enter Valid Email");
      return;
    } else {
      // ===========OTP Send Part===============
      setLoaderState(true);
      try {
        // ============Check Email alredy Exits or Not============
        const EmailFetch = await fetch(
          `${Backend_Path()}/find/loginuser${EmailValue.email}`
        );
        const EmailResponse = await EmailFetch.json();
        if (EmailResponse.email == EmailValue.email) {
          setLoaderState(false);
          toast.error("Email id allready exits!!");
          return;
        } else {
          try {
            setOTP_Counter(true);
            const FetchRoute = await fetch(
              `${Backend_Path()}/verify-otp${EmailValue.email}`
            );
            const Response = await FetchRoute.json();
            // console.log(Response);
            OTPref.current = Response.OTP;
            toast.success("OTP Send your Email");
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
  const VarifyEmail = async () => {
    const OTP =
      inputOTP.first + inputOTP.second + inputOTP.thard + inputOTP.fourth;
    if (OTP == OTPref.current) {
      setisLoaderOpen(true);
      try {
        const UpdatedData = await axios.post(
          `${Backend_Path()}/home/update-email${localStorage.getItem("id")}`,
          { email: EmailValue }
        );
        // console.log(UpdatedData);

        setUser_information(UpdatedData.data[0]);
        setisOpen(false);
        setisOpenOTP(false);
        setisLoaderOpen(false);
        toast.success("Update Successfully");
      } catch (err) {
        console.log(err);
        setisLoaderOpen(false);
        toast.error("Server Error");
      }
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
      <div class="flex flex-col gap-2">
        <Loader isLoaderOpen={isLoaderOpen} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p class="text-gray-600">
            Your email address is <strong>{User_information?.email}</strong>
          </p>
          <button
            class="inline-flex text-sm font-semibold text-blue-600 underline decoration-2"
            onClick={() => setisOpen(true)}
          >
            Change
          </button>
        </div>
        <label
          for="email_address"
          className={` transition-all duration-500 ease-in-out ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 h-0 pointer-events-none"
          }`}
        >
          <span class="text-sm text-gray-500">New Email</span>
          <div class="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600 md:w-[50%]">
            <input
              type="email"
              name="email"
              value={EmailValue.email}
              onChange={(e) => EmailValueFunction(e)}
              id="email_address"
              class="flex-shrink w-full appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
              placeholder="Enter email address"
            />
          </div>
          <button
            class={`mt-4 w-fit rounded-lg transition-all duration-300 ease-in-out flex items-center bg-blue-600 px-3 gap-2 py-2 text-white ${
              !isOpenOTP
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 h-0 mt-0 pointer-events-none"
            }`}
            onClick={() => SendOTP()}
          >
            <svg
              aria-hidden="true"
              role="status"
              class={`text-white transition-all duration-200 ease-in-out animate-spin  ${
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
            </svg>
            Send Otp
          </button>
          <div
            className={`w-full flex transition-all duration-500 ease-in-out flex-col mt-4 
                          ${
                            isOpenOTP
                              ? "opacity-100 pointer-events-auto"
                              : "opacity-0 h-0 pointer-events-none"
                          }`}
            //    ${
            //   VerifyEmail ? "hidden" : null
            //   }
            // `}
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
              setOTP_Counter={setOTP_Counter}
              OTP_Counter={OTP_Counter}
              setLoaderState={setLoaderState}
              LoaderState={LoaderState}
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
        </label>
      </div>
    </>
  );
};
