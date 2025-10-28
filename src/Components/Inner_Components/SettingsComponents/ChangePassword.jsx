import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Backend_Path } from "../LogInPage/Backend_Path";
import { Loader } from "../../Loader/Loader";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
export const ChangePassword = ({ User_information, setUser_information }) => {
  const [ShowPassword, setShowPassword] = useState(false);
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const [inputBoxValue, setinputBoxValue] = useState({
    currentpassword: "",
    newpassword: "",
  });
  const InputboxValueFunction = (e) => {
    const { name, value } = e.target;
    setinputBoxValue((prev) => ({ ...prev, [name]: value }));
  };
  const SavePassword = async () => {
    if (inputBoxValue.currentpassword == "") {
      toast.error("Enter Current Password");
    } else if (inputBoxValue.newpassword == "") {
      toast.error("Enter New Password");
    } else if (User_information?.password != inputBoxValue.currentpassword) {
      toast.error("Current Password not Matched");
    } else if (inputBoxValue.currentpassword == inputBoxValue.newpassword) {
      toast.error("Current Password & New Password are Same");
    } else {
      try {
        setisLoaderOpen(true);
        const UpdatePassword = await axios.post(
          `${Backend_Path()}/home/change-password${localStorage.getItem("id")}`,
          { password: inputBoxValue.newpassword }
        );
        setUser_information(UpdatePassword.data);
        setisLoaderOpen(false);
        toast.success("Password Change Successfully");
        setinputBoxValue({
          currentpassword: "",
          newpassword: "",
        });
      } catch (err) {
        setisLoaderOpen(false);
        toast.error("Server Error");
      }
    }
  };
  return (
    <>
      <div>
        <Loader isLoaderOpen={isLoaderOpen} />
        <p class="py-2 text-xl font-semibold">Password</p>
        <div class="flex items-center">
          <div class="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <label for="login-password">
              <span class="text-sm text-gray-500">Current Password</span>
              <div class="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                <input
                  type={ShowPassword ? "text" : "password"}
                  id="login-password"
                  name="currentpassword"
                  value={inputBoxValue.currentpassword}
                  onChange={(e) => InputboxValueFunction(e)}
                  class="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-md text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="***********"
                />
              </div>
            </label>
            <label for="login-confirm-password">
              <span class="text-sm text-gray-500">New Password</span>
              <div class="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                <input
                  type={ShowPassword ? "text" : "password"}
                  id="login-confirm-password"
                  name="newpassword"
                  value={inputBoxValue.newpassword}
                  onChange={(e) => InputboxValueFunction(e)}
                  class="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-md text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="***********"
                />
              </div>
            </label>
          </div>
          <div
            className="text-gray-500 cursor-pointer mt-6 ml-3  text-2xl"
            onClick={() => setShowPassword((prev) => (prev ? false : true))}
          >
            {ShowPassword ? <IoEye className="text-blue-500" /> : <IoMdEyeOff />}
          </div>
        </div>
        <p class="mt-2">
          Can't remember your current password.{" "}
          <a
            class="text-sm font-semibold text-blue-600 underline decoration-2"
            href="#"
          >
            Recover Account
          </a>
        </p>
        <button
          class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
          onClick={() => SavePassword()}
        >
          Save Password
        </button>
      </div>
    </>
  );
};
