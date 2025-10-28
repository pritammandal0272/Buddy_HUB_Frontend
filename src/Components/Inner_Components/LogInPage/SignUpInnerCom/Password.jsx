import React, { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
export const Password = ({ SignUpInput, setSignUpInput }) => {
  const [ShowPasswordFirst, setShowPasswordFirst] = useState(false);
  const [ShowPasswordCon, setShowPasswordCon] = useState(false);
  const InputBoxValueFunction = (e) => {
    const { name, value } = e.target;
    setSignUpInput((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <div className=" shrink-0 w-full mr-9">
        <div className={`flex flex-col gap-2`}>
          <div>
            <div className="flex">
              <label
                className="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                // for="SignUpnewpassword"
              >
                Password
              </label>
            </div>
            <div className="flex items-center  bg-white border rounded-md  overflow-hidden pr-2 shadow-sm justify-end">
              <input
                // id="SignUpnewpassword"
                name="password"
                className="block w-full px-4 py-2 text-gray-700 focus:outline-none"
                type={!ShowPasswordFirst ? "password" : "text"}
                placeholder="••••••••"
                value={SignUpInput.password}
                onChange={(e) => InputBoxValueFunction(e)}
              />
              <div
                className="text-gray-500 cursor-pointer text-2xl"
                onClick={() =>
                  setShowPasswordFirst((prev) => (prev ? false : true))
                }
              >
                {ShowPasswordFirst ? (
                  <IoEye className="text-blue-500" />
                ) : (
                  <IoMdEyeOff />
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex">
              <label
                className="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                // for="SignUpnewconpassword"
              >
                Confirm Password
              </label>
            </div>
            <div className="flex items-center  bg-white border rounded-md  overflow-hidden pr-2 shadow-sm justify-end">
              <input
                // id="SignUpnewconpassword"
                name="conpassword"
                className="block w-full px-4 py-2 text-gray-700 focus:outline-none"
                type={!ShowPasswordCon ? "password" : "text"}
                placeholder="••••••••"
                value={SignUpInput.conpassword}
                onChange={(e) => InputBoxValueFunction(e)}
              />
              <div
                className="text-gray-500 cursor-pointer text-2xl"
                onClick={() =>
                  setShowPasswordCon((prev) => (prev ? false : true))
                }
              >
                {ShowPasswordCon ? (
                  <IoEye className="text-blue-500" />
                ) : (
                  <IoMdEyeOff />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
