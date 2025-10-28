import React, { useState } from "react";
import toast from "react-hot-toast";
export const OtpVarification = ({
  isOpen,
  setisOpen,
  PassWordDiv_Show,
  OTP,
}) => {
  const [InputBoxState, setInputBoxState] = useState({
    first: "",
    second: "",
    thard: "",
    fourth: "",
  });
  const VarifyEmail = () => {
    let TypeIngOTP = "";
    TypeIngOTP +=
      InputBoxState.first +
      InputBoxState.second +
      InputBoxState.thard +
      InputBoxState.fourth;
    if (TypeIngOTP == OTP.current) {
      toast.success("Email id Varified");
      setisOpen("sign-up");
    } else {
      toast.error("Invalid Otp Check again");
    }
    PassWordDiv_Show.current = true;
  };
  const InputBoxValue = (e) => {
    const { name, value } = e.target;
    setInputBoxState((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div
      className={`items-center justify-center flex-col rounded-2xl overflow-hidden shadow-lg ${
        isOpen == "OTP" ? "flex" : "hidden"
      }`}
    >
      <section className="max-w-2xl mx-auto bg-[#f0f2f5] ">
        <div className="h-fit py-3 bg-[#365CCE] w-full text-white flex items-center justify-center flex-col ">
          <div className="flex flex-col gap-3">
            <div className="text-center text-sm sm:text-xl tracking-widest font-normal">
              THANKS FOR SIGNING UP!
            </div>
            <div className="text-xl sm:text-3xl tracking-wider font-bold capitalize">
              Verify your E-mail Address
            </div>
          </div>
        </div>
        <div className=" py-3 px-5">
          <h2 className="text-gray-700 ">Hello Pritam Mandal,</h2>
          <p className="mt-2 leading-loose text-gray-600 ">
            Please use the following One Time Password(OTP)
          </p>
          <div class="w-full flex flex-row gap-2.5 mt-4">
            <input
              maxlength="1"
              type="text"
              name="first"
              value={InputBoxState.first}
              onChange={(e) => InputBoxValue(e)}
              class="w-10 h-10 font-medium text-[#365CCE] border border-[#365CCE] rounded-md text-center text-2xl"
            />
            <input
              maxlength="1"
              type="text"
              name="second"
              value={InputBoxState.second}
              onChange={(e) => InputBoxValue(e)}
              class="w-10 h-10 font-medium text-[#365CCE] border border-[#365CCE] rounded-md text-center text-2xl"
            />
            <input
              maxlength="1"
              type="text"
              name="thard"
              value={InputBoxState.thard}
              onChange={(e) => InputBoxValue(e)}
              class="w-10 h-10 font-medium text-[#365CCE] border border-[#365CCE] rounded-md text-center text-2xl"
            />
            <input
              maxlength="1"
              type="text"
              name="fourth"
              value={InputBoxState.fourth}
              onChange={(e) => InputBoxValue(e)}
              class="w-10 h-10 font-medium text-[#365CCE] border border-[#365CCE] rounded-md text-center text-2xl"
            />
          </div>
          <p className="mt-4 leading-loose text-gray-600">
            This passcode will only be valid for the next
            <span className="font-bold"> 2 minutes</span> . If the passcode does
            not work, you can use this login verification link:
          </p>
          <button
            className="px-6 py-2 mt-6 text-sm font-bold tracking-wider text-white capitalize transition-colors duration-300 transform bg-orange-600 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring focus:ring-orange-300 focus:ring-opacity-80"
            onClick={() => VarifyEmail()}
          >
            Verify email
          </button>
          <p className="mt-8 text-gray-600">
            Thank you, <br />
            Pritam's Team
          </p>
          <p className="text-gray-500 pt-5">
            This email was sent from{" "}
            <a
              href="mailto:sales@infynno.com"
              className="text-[#365CCE] hover:underline"
              alt="sales@infynno.com"
              target="_blank"
            >
              mandal4142@gmai.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};
