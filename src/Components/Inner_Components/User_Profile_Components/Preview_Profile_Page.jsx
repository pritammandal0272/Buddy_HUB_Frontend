import React, { useState } from "react";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import coverimage from "../../../assets/Images/cover_image.jpg";
import "../../../assets/Styles/style.css";
import { IoCloseSharp } from "react-icons/io5";
import { Loader } from "../../Loader/Loader";
export const Preview_Profile_Page = ({
  User_information,
  setisPreviewOpen,
  isPreviewOpen,
  inputData,
  Flagref,
  InsertImage_DB,
  isLoaderOpen,
}) => {
  const BolbImage = inputData ? URL.createObjectURL(inputData) : null;
  // console.log(Flagref);
  
  return (
    <>
      <div
        className={`fixed z-50 h-[100vh] w-full bg-[#00000090] Preview_Profile_Page md:p-48 pt-52 px-2 ${
          isPreviewOpen ? "block" : "hidden"
        }`}
      >
        <Loader isLoaderOpen={isLoaderOpen} />

        <div className="flex justify-between mb-1 items-center">
          <h1 className="text-xl font-bold text-fuchsia-500">Preview</h1>
          <IoCloseSharp
            className="text-4xl text-red-600 cursor-pointer"
            onClick={() => setisPreviewOpen(false)}
          />
        </div>
        <div className="relative">
          <div className="h-[30vh] overflow-hidden">
            <img
              src={
                Flagref.current == "cover"
                  ? BolbImage
                  : User_information[0]?.coverPhoto == ""
                  ? coverimage
                  : User_information[0]?.coverPhoto
              }
              alt="Cover"
              className="w-full h-[100%] rounded-tl-md rounded-tr-md"
            />
          </div>
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <img
              src={
                Flagref.current == "profile"
                  ? BolbImage
                  : User_information[0]?.profilePic == ""
                  ? blank_profile_img
                  : User_information[0]?.profilePic
              }
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-white"
            />
          </div>
        </div>
        <button
          type="button"
          class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right mt-5"
          onClick={() => InsertImage_DB()}
        >
          Save
        </button>
      </div>
    </>
  );
};
