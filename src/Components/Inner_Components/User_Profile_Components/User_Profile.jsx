import React, { useContext, useEffect, useState } from "react";
import { Post } from "./Post";
import profile from "../../../assets/Images/profile.jpg";
import cover_image from "../../../assets/Images/cover_image.webp";
import { Cover_and_Profile } from "./Cover_and_Profile";
import { Intro_and_FrindsList } from "./Intro_and_FriendsList";
import { NavLink, useLocation } from "react-router-dom";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import toast, { Toaster } from "react-hot-toast";
export const User_Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const location = useLocation();
  const { User_information, isLoaderOpen, setisLoaderOpen } =
    useContext(BranchStoreApi);
  const [isAllOptionOpen, setisAllOptionOpen] = useState("all");
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [User_information]);
  return (
    <div className="bg-[#f0f2f5] h-fit md:pb-1 pt-2">
      <Toaster />

      <div className="bg-white shadow mb-4 ">
        <Cover_and_Profile />
        <div className="border-t border-gray-300 px-8">
          <div className="flex gap-8 p-3">
            <p
              className={`${
                isAllOptionOpen == "all"
                  ? "border-b-4 rounded-xl border-blue-500 px-4 font-semibold cursor-pointer"
                  : "text-gray-400 cursor-pointer"
              }`}
              onClick={() => setisAllOptionOpen("all")}
            >
              All
            </p>
            <p
              className={`${
                isAllOptionOpen == "posts"
                  ? "border-b-4 rounded-xl border-blue-500 px-4 font-semibold cursor-pointer"
                  : "text-gray-400 cursor-pointer"
              }`}
              onClick={() => setisAllOptionOpen("posts")}
            >
              Posts
            </p>
            <p
              className={`${
                isAllOptionOpen == "friends"
                  ? "border-b-4 rounded-xl border-blue-500 px-4 font-semibold cursor-pointer"
                  : "text-gray-400 cursor-pointer"
              }`}
              onClick={() => setisAllOptionOpen("friends")}
            >
              Friends
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <div className="mt-2">
          {/* LeftSideBar Start */}
          <Intro_and_FrindsList isAllOptionOpen={isAllOptionOpen} />
          {/* LeftSideBar End */}
        </div>
        <div
          className={`mt-4 ${
            isAllOptionOpen == "all" || isAllOptionOpen == "posts"
              ? "block"
              : "hidden"
          }`}
        >
          {/* CreatePost Start */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex gap-3">
              <img
                src={
                  User_information[0]?.profilePic == ""
                    ? blank_profile_img
                    : User_information[0]?.profilePic
                }
                alt="Loading.."
                className="w-10 h-10 rounded-full"
              />
              <input
                type="text"
                placeholder="What's on your mind?"
                className="bg-gray-100 rounded-full px-4 py-2 w-full hover:bg-gray-200 cursor-pointer"
                readOnly
              />
            </div>
          </div>
          {/* CreatePost End */}
          <Post />
          {/* ================Date Of Birth Part Start============ */}
          <div className={`bg-white rounded-lg shadow p-4 mb-4`}>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={
                  User_information[0]?.profilePic == ""
                    ? blank_profile_img
                    : User_information[0]?.profilePic
                }
                alt={"Loading"}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{User_information[0]?.name}</h3>
                <p className="text-gray-500 text-sm">
                  {User_information[0]?.time?.split("T")[0]}
                </p>
              </div>
            </div>
            <div className="w-full flex items-center justify-center flex-col">
              <div className="text-4xl p-2 bg-blue-600 rounded-full text-white shadow-2xl">
                <LiaBirthdayCakeSolid />
              </div>
              <p className={`font-semibold text-lg`}>
                Born on{" "}
                {User_information[0]?.dob.split("/")[1] +
                  " " +
                  User_information[0]?.dob.split("/")[0] +
                  " " +
                  User_information[0]?.dob.split("/")[2]}{" "}
              </p>
            </div>
          </div>
          {/* ================Date Of Birth Part End============ */}
        </div>
      </div>
     
    </div>
  );
};
