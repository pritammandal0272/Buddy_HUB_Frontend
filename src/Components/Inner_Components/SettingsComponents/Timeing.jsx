import React, { useEffect, useState } from "react";
import { Backend_Path } from "../LogInPage/Backend_Path";
import toast from "react-hot-toast";
export const Timeing = ({
  OTP_Counter,
  setOTP_Counter,
  LoaderState,
  setLoaderState,
  EmailValue,
  OTPref,
}) => {
  const [Counter, setCounter] = useState(59);
  useEffect(() => {
    // console.log(OTP_Counter);
    let ClearTimeout;
    if (OTP_Counter) {
      ClearTimeout = setInterval(() => {
        setCounter((prev) => {
          if (prev == 0) {
            clearInterval(ClearTimeout);
            setOTP_Counter(false);
            return 59;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(ClearTimeout);
  }, [OTP_Counter]);
  const ResendOTP = async () => {
    setLoaderState(true);
    try {
      const FetchRoute = await fetch(
        `${Backend_Path()}/verify-otp${EmailValue.email}`
      );
      const Response = await FetchRoute.json();
      console.log(Response);
      setOTP_Counter(true);
      OTPref.current = Response.OTP;
      toast.success("OTP Resend your Email Successfully");
      setLoaderState(false);
    } catch (err) {
      console.log(err);
      setLoaderState(false);
    }
  };
  return (
    <>
      <p className="mt-2 text-gray-500 flex items-center gap-1">
        If you didn't received a Code!{" "}
        <span className="text-red-400 text-lg font-bold">
          {Counter == 59 ? (
            <span
              className="text-red-400 flex items-center gap-1 font-bold cursor-pointer"
              onClick={() => ResendOTP()}
            >
              Resend
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
            </span>
          ) : (
            `00 : ${Counter < 10 ? 0 : ""}${Counter}`
          )}
        </span>
        {/* <span className="text-red-400 font-bold cursor-pointer">Resend</span> */}
      </p>
    </>
  );
};
