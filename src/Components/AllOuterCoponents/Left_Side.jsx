import React, { useContext, useState } from "react";
import profile from "../../assets/Images/profile.jpg";
import Home from "../../assets/Images/Home.png";
import Connection_Img from "../../assets/Images/Connection_Img.png";
import News_Img from "../../assets/Images/News_Img.png";
import Events_Img from "../../assets/Images/Events_Img.png";
import Notifiction_Img from "../../assets/Images/Notifiction_Img.png";
import Groups_Img from "../../assets/Images/Groups_Img.png";
import Settings_Img from "../../assets/Images/Settings_Img.png";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import blank_profile_img from "../../assets/Images/black_profile.jpg";
import coverimage from "../../assets/Images/cover_image.jpg";
import { BranchStoreApi } from "../../BranchStore/BranchStore";
import "../../assets/Styles/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { LeftSide_Bar_Messenger } from "../Inner_Components/One_Components_Render/LeftSide_Bar_Messenger";
import { LeftSide_Bar_Notification } from "../Inner_Components/One_Components_Render/LeftSide_Bar_Notification";
import socket from "../../soket";
export const Left_Side_Bar = () => {
  const { User_information } = useContext(BranchStoreApi);
  const { re_RenderState, setre_RenderState } = useContext(BranchStoreApi);
  const [ReroadFriendComponent, setReroadFriendComponent] = useState(0);
  const [UserAllData, setUserAllData] = useState();
  useEffect(() => {
    console.log("");
  }, [User_information, re_RenderState]);
  useEffect(() => {
    socket.on("user_friend_request_frontend", (data) => {
      if (
        data.recever_id == localStorage.getItem("id") ||
        data.sender_id == localStorage.getItem("id")
      )
        setre_RenderState((prev) => prev + 1);
    });
  }, [socket]);
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  return (
    <>
      <div className="hidden z-20 md:block w-[17em] overflow-scroll  pt-[9vh] h-[100vh] bg-[#f0f2f5] fixed px-4 Scroll">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className={`max-w-sm rounded overflow-hidden shadow bg-white`}>
              <div className={`${isLoaderOpen ? "hidden" : "block"}`}>
                <div className="relative">
                  <img
                    className="w-full h-[30vh]"
                    src={
                      User_information[0]?.coverPhoto == ""
                        ? coverimage
                        : User_information[0]?.coverPhoto
                    }
                    alt="Loading..."
                  />
                  <div className="clippy absolute bottom-0 left-0 top-0 right-0 bg-gray-900 bg-opacity-50 p-4 text-white flex flex-col justify-end items-center"></div>
                  <div
                    className={`absolute bottom-0 right-0 mb-6 mr-6 rounded-full h-16 w-16 flex items-center justify-center text-4xl font-thin overflow-hidden border-2 shadow-2xl bg-no-repeat bg-cover`}
                  >
                    <img
                      src={
                        User_information[0]?.profilePic == ""
                          ? blank_profile_img
                          : User_information[0]?.profilePic
                      }
                      className="h-fit w-fit"
                      alt="Loading..."
                    />
                  </div>
                </div>
                <div className="pt-3 pb-1 px-5 flex flex-col items-center">
                  <p className="font-bold text-2xl text-center">
                    {User_information[0]?.name}
                  </p>
                  <p className="text-gray-500 mb-2 text-center">
                    {User_information[0]?.bio}
                  </p>
                  <div className="flex flex-row align-center justify-center"></div>
                  <div className="flex flex-row justify-center items-start border-b-2 border-b-gray-200 pb-3">
                    <div className="px-3 text-center">
                      <p className="text-gray-500">Post</p>
                      <b className="text-xl">
                        {User_information[2]?.posts.length}
                      </b>
                    </div>
                    <div className="px-3 text-center">
                      <p className="text-gray-500">Friends</p>
                      <b className="text-xl">
                        {User_information[1]?.friends.length}
                      </b>
                    </div>
                    <div className="px-3 text-center">
                      <p className="text-gray-500">Following</p>
                      <b className="text-xl">0</b>
                    </div>
                  </div>
                </div>
              </div>
              {/* ==============Skeleten Loader Start=============== */}
              <div
                className={`animate-pulse h-[50%] flex flex-col justify-center ${
                  isLoaderOpen ? "block" : "hidden"
                }`}
              >
                <p
                  className="h-4 bg-gray-200 rounded-full dark:bg-neutral-500"
                  style={{ width: "40%" }}
                ></p>

                <ul className="mt-5 space-y-3">
                  <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-400"></li>
                  <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-400"></li>
                  <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-400"></li>
                  <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-400"></li>
                  <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-400"></li>
                </ul>
              </div>
              {/* ==============Skeleten Loader End=============== */}
              <div>
                <div className="px-7 flex flex-col gap-1">
                  <NavLink
                    to={"/feed"}
                    className={({ isActive }) => {
                      if (isActive) {
                        return "text-blue-600 scale-110 transition-all duration-100 ease-in-out ml-2";
                      }
                    }}
                  >
                    <div className="flex items-center gap-1 text-[16px] font-semibold">
                      <img src={Home} alt="" className="h-[27px] w-[27px]" />
                      Feed
                    </div>
                  </NavLink>
                  <NavLink
                    to={"/connections"}
                    className={({ isActive }) => {
                      if (isActive) {
                        return "text-blue-600 scale-110 transition-all duration-100 ease-in-out ml-2";
                      }
                    }}
                  >
                    <div className="flex items-center gap-1 text-[16px] font-semibold">
                      <img
                        src={Connection_Img}
                        alt=""
                        className="h-[25px] w-[25px]"
                      />
                      Connections
                    </div>
                  </NavLink>
                  <NavLink
                    to={"/latestnews"}
                    className={({ isActive }) => {
                      if (isActive) {
                        return "text-blue-600 scale-110 transition-all duration-100 ease-in-out ml-2";
                      }
                    }}
                  >
                    <div className="flex items-center gap-1 text-[16px] font-semibold">
                      <img
                        src={News_Img}
                        alt=""
                        className="h-[25px] w-[25px]"
                      />
                      Latest News
                    </div>
                  </NavLink>
                  <LeftSide_Bar_Messenger Events_Img={Events_Img} />
                  <NavLink
                    to={"/groups"}
                    className={({ isActive }) => {
                      if (isActive) {
                        return "text-blue-600 scale-110 transition-all duration-100 ease-in-out ml-2";
                      }
                    }}
                  >
                    <div className="flex items-center gap-1 text-[16px] font-semibold">
                      <img
                        src={Groups_Img}
                        alt=""
                        className="h-[23px] w-[23px]"
                      />
                      Groups
                    </div>
                  </NavLink>
                  <LeftSide_Bar_Notification
                    Notifiction_Img={Notifiction_Img}
                  />
                  <NavLink
                    to={"/settings"}
                    className={({ isActive }) => {
                      if (isActive) {
                        return "text-blue-600 scale-110 transition-all duration-100 ease-in-out ml-2";
                      }
                    }}
                  >
                    <div className="flex items-center gap-1 text-[16px] font-semibold">
                      <img
                        src={Settings_Img}
                        alt=""
                        className="h-[21px] w-[21px]"
                      />
                      Settings
                    </div>
                  </NavLink>
                </div>
                <div className="p-3 flex justify-center">
                  <NavLink
                    to={"/view-profile"}
                    className={({ isActive }) => {
                      if (isActive) {
                        return "text-blue-600 scale-110 border-b-4 rounded-lg border-purple-500 bg-blue-200 transition-all duration-100 ease-in-out ml-2";
                      } else {
                        return "text-gray-400";
                      }
                    }}
                  >
                    <h2 className="font-bold  cursor-pointer px-2">
                      View Profile
                    </h2>
                  </NavLink>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
