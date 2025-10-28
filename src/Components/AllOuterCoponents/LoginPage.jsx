import React, { useContext, useRef, useState } from "react";
import BackgroundImage from "../../assets/Images/bgImage.png";
import BackgroundImg2 from "../../assets/Images/BackgroundImg2.jpg";
import { SignUp } from "../Inner_Components/LogInPage/SignUpComponents";
import { SignIn } from "../Inner_Components/LogInPage/SignInComponents";
import "../../assets/Styles/style.css";
import { OtpVarification } from "../Inner_Components/LogInPage/OptVarification";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Backend_Path } from "../Inner_Components/LogInPage/Backend_Path";
import { useNavigate } from "react-router-dom";
import { GoogleRedirectPasswordset } from "../Inner_Components/LogInPage/GoogleRedirectPasswordset";
import { BranchStoreApi } from "../../BranchStore/BranchStore";
import { SignUpPageNew } from "../Inner_Components/LogInPage/SignUpPagenew";
export const LogInPage = () => {
  const [SignUpInput, setSignUpInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    day: "",
    month: "",
    year: "",
    password: "",
    conpassword: "",
  });
  const [isOpen, setisOpen] = useState("sign-in");
  const [LoaderState, setLoaderState] = useState(false);

  const PassWordDiv_Show = useRef(false);
  const navigate = useNavigate();
  const OTP = useRef();
  // const [GoogleData, setGoogleData] = useState(null);
  const GoogleData = useRef();
  let Response;
  useEffect(() => {
    const LocalData = localStorage.getItem("id");
    if (LocalData != null) {
      navigate("/feed");
      return;
    }
    const FetchGoogledata = async () => {
      try {
        const FetchData = await fetch(`${Backend_Path()}/google-data`);
        Response = await FetchData.json();
        // setGoogleData(Response);
        // console.log(Response);
        // setisOpen("google-pass");
        if (Response.email == "not") return;
        if (Response.google_insert == true && Response.email != "") {
          setisOpen("google-pass");
          // GoogleData.current = Response.email;
          const NAME = Response.name.split(" ");
          console.log(NAME);

          setSignUpInput((prev) => ({ ...prev, email: Response.email }));
          setSignUpInput((prev) => ({ ...prev, firstname: NAME[0] }));
          setSignUpInput((prev) => ({ ...prev, lastname: NAME[1] }));
        } else {
          toast.error("Email allready Exits !!");
        }
        // console.log(Response.displayName, Response.emails[0].value);
      } catch (error) {
        console.log(error);
      }
    };
    FetchGoogledata();
  }, [Response]);
  return (
    <div className="w-full h-[100vh] md:flex ">
      <Toaster />
      <div
        className="h-[50%] md:w-[60%]  md:h-full flex md:items-center p-4 md:p-0 md:justify-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="relative p-0 z-10 w-full md:px-20 px-2">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
              More than just friends truly connect
            </h1>
            <p className="text-xl md:text-xl text-indigo-900 max-w-72 md:max-w-md">
              Create an account and get access to all features & Explore, Share
              your Opinion, Feedback, Post etc...
            </p>
            <div className="flex items-center -space-x-2 overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/women/79.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://randomuser.me/api/portraits/men/86.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <p className="text-sm text-gray-400 font-medium translate-x-5">
                Join 5.000+ users
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="h-[50%] md:w-[40%] md:h-full relative  bg-no-repeat bg-cover "
        style={{ backgroundImage: `url(${BackgroundImg2})` }}
      >
        <div className="absolute w-[98%]  md:-left-24 md:w-full px-2  LogInPageAbsoluteCenterDiv">
          <div className="relative lg:max-w-md p-1 border border-red-500 border-opacity-60 rounded-2xl md:w-[30em] w-full shadow-2xl overflow-hidden">
            {/* <SignUp
              isOpen={isOpen}
              setisOpen={setisOpen}
              PassWordDiv_Show={PassWordDiv_Show}
              OTP={OTP}
            /> */}
            <SignUpPageNew
              isOpen={isOpen}
              setisOpen={setisOpen}
              SignUpInput={SignUpInput}
              setSignUpInput={setSignUpInput}
              setLoaderState={setLoaderState}
              LoaderState={LoaderState}
            />
            <SignIn isOpen={isOpen} setisOpen={setisOpen} />
            {/* <OtpVarification
              isOpen={isOpen}
              setisOpen={setisOpen}
              PassWordDiv_Show={PassWordDiv_Show}
              OTP={OTP}
            /> */}
            <GoogleRedirectPasswordset
              isOpen={isOpen}
              setisOpen={setisOpen}
              GoogleData={GoogleData}
              SignUpInput={SignUpInput}
              setSignUpInput={setSignUpInput}
              setLoaderState={setLoaderState}
              LoaderState={LoaderState}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
