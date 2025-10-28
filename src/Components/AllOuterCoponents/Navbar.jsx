import React, { useContext, useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import Social_Pic from "../../assets/Images/Social.jpg";
import logo from "../../assets/Images/logo.png";
import logo1 from "../../assets/Images/logo1.jpg";
import { IoSearchOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { MdOutlineNewspaper } from "react-icons/md";
import blank_profile_img from "../../assets/Images/black_profile.jpg";
import { BranchStoreApi } from "../../BranchStore/BranchStore";
import { Backend_Path } from "../../Backend_Path";
import axios from "axios";
import { Navbar_Notifications } from "../Inner_Components/One_Components_Render/Navbar_Notification";
import { Navbar_Messenger } from "../Inner_Components/One_Components_Render/Navbar_Messenger";
import { NavbarScarchbar } from "../Inner_Components/Feed_Components/NavbarSearch";
export const Navbar = () => {
  const { User_information } = useContext(BranchStoreApi);
  const [navbarShow, setnavbarShow] = useState(true);
  const [lastScrollY, setlastScrollY] = useState(0);
  const [NavbarMobileSearchAnimation, setNavbarMobileSearchAnimation] =
    useState(false);
  useEffect(() => {
    const ScrollFunction = () => {
      let CurrentScroll = window.scrollY;
      if (CurrentScroll > lastScrollY) {
        setnavbarShow(false);
      } else {
        setnavbarShow(true);
      }
      setlastScrollY(CurrentScroll);
      // console.log(window.scrollY + window.innerHeight > window.innerHeight);
    };
    window.addEventListener("scroll", ScrollFunction);
    return () => window.removeEventListener("scroll", ScrollFunction);
  },[lastScrollY]);
  return (
    <>
      <div
        className={`w-full h-[13vh] transition-all duration-200 ease-in-out md:h-[8vh] bg-white fixed z-50 md:px-8 px-2 shadow-md transform ${
          navbarShow ? "translate-y-0" : "md:translate-y-0 -translate-y-60"
        }`}
      >
        {/* Small Screen */}
        <div
          className={`md:hidden h-[50%] transition-all duration-500 ease-in-out flex items-center justify-between`}
        >
          <h1
            className={`text-2xl text-blue-600 font-bold transition-all duration-0 ease-in ${
              NavbarMobileSearchAnimation
                ? "max-w-0 opacity-0"
                : "max-w-[200px] opacity-100"
            }`}
          >
            <img src={logo1} alt="" className=" h-12" />
          </h1>
          <NavbarScarchbar
            NavbarMobileSearchAnimation={NavbarMobileSearchAnimation}
            setNavbarMobileSearchAnimation={setNavbarMobileSearchAnimation}
          />
          <div
            className={`md:w-[20%] h-full flex items-center justify-end gap-2`}
          >
            <div
              className={`${
                NavbarMobileSearchAnimation
                  ? "h-10 w-10  flex items-center justify-end text-[25px] text-blue-600 scale-110 transition-all duration-300 ease-in-out"
                  : "h-10 w-10  flex items-center justify-end text-[25px] "
              }`}
              onClick={() =>
                setNavbarMobileSearchAnimation((prev) => (prev ? false : true))
              }
            >
              <IoSearchOutline className="cursor-pointer" />
            </div>
            <Navbar_Messenger />
          </div>
        </div>
        {/* Small Screen End */}
        <div className="flex h-[50%] w-full md:h-full justify-between items-center">
          <div
            className={` hidden md:w-[40%] md:flex h-full items-center justify-center`}
          >
            <img src={logo} alt="" className="w-10% h-[90%] hidden md:block" />
            <NavbarScarchbar />
          </div>
          <div
            className={`hidden w-[40%] h-full md:flex items-center justify-center gap-4 font-semibold text-[17px]`}
          >
            <NavLink
              to={"/feed"}
              className={({ isActive }) => {
                if (isActive) {
                  return "text-blue-600 border-b-2 rounded-md border-blue-500 px-2 font-semibold cursor-pointer scale-110 transition-all duration-100 ease-in-out";
                }
              }}
            >
              Home
            </NavLink>
            <NavLink
              to={"/view-profile"}
              className={({ isActive }) => {
                if (isActive) {
                  return "text-blue-600 border-b-2 rounded-md border-blue-500 px-2 scale-110 transition-all duration-100 ease-in-out";
                }
              }}
            >
              Account
            </NavLink>
            {/* <NavLink
            to={"/"}
            className={({ isActive }) => {
              if (isActive) {
                return "text-blue-600 scale-110 transition-all duration-300 ease-in-out";
              }
            }}
          > */}
            <p>My Network</p>
            {/* </NavLink> */}
            {/* <NavLink
            to={"/"}
            className={({ isActive }) => {
              if (isActive) {
                return "text-blue-600 scale-110 transition-all duration-300 ease-in-out";
              }
            }}
          > */}
            <p>Help</p>
            {/* </NavLink> */}
          </div>
          <div
            className={`md:w-[20%] w-full h-full flex items-center justify-between gap-2 p-2`}
          >
            <NavLink
              to={"/feed"}
              className={({ isActive }) => {
                return isActive
                  ? `h-9 border-b-4 rounded-lg border-purple-500 font-semibold cursor-pointer  w-10 bg-blue-200   flex items-center justify-center text-[20px] text-blue-600 scale-110 transition-all duration-100 ease-in-out`
                  : `h-9 w-10 bg-slate-300 rounded-lg  flex items-center justify-center text-[20px] text-gray-600`;
              }}
            >
              <FaHome />
            </NavLink>
            <NavLink
              to={"/connections"}
              className={({ isActive }) => {
                return isActive
                  ? `h-9 border-b-4 rounded-lg border-purple-500 font-semibold cursor-pointer  w-10 bg-blue-200   flex items-center justify-center text-[20px] text-blue-600 scale-110 transition-all duration-100 ease-in-out`
                  : `h-9 w-10 bg-slate-300 rounded-lg  flex items-center justify-center text-[20px] text-gray-600`;
              }}
            >
              <IoPeople />
            </NavLink>
            <NavLink
              to={"/latestnews"}
              className={({ isActive }) => {
                return isActive
                  ? `h-9 border-b-4 rounded-lg border-purple-500 font-semibold cursor-pointer  w-10 bg-blue-200   flex items-center justify-center text-[20px] text-blue-600 scale-110 transition-all duration-100 ease-in-out`
                  : `h-9 w-10 bg-slate-300 rounded-lg  flex items-center justify-center text-[20px] text-gray-600`;
              }}
            >
              <MdOutlineNewspaper />
            </NavLink>
            <NavLink
              to={"/settings"}
              className={({ isActive }) => {
                return isActive
                  ? `h-9 border-b-4 rounded-lg border-purple-500 font-semibold cursor-pointer  w-10 bg-blue-200   flex items-center justify-center text-[20px] text-blue-600 scale-110 transition-all duration-100 ease-in-out`
                  : "h-9 w-10 bg-slate-300 rounded-lg flex items-center justify-center text-[20px] text-gray-600";
              }}
            >
              <IoMdSettings />
            </NavLink>
            <Navbar_Notifications />

            <NavLink
              to={"/view-profile"}
              className={({ isActive }) => {
                return isActive
                  ? `h-9 cursor-pointer border-b-4 border-b-purple-600 w-10 bg-blue-200 rounded-lg overflow-hidden flex items-center justify-center text-blue-600 scale-110 transition-all duration-100 ease-in-out`
                  : "h-9 w-9 bg-slate-300 rounded-lg flex items-center justify-center text-[20px] text-gray-600 overflow-hidden cursor-pointer";
              }}
            >
              <img
                src={
                  User_information[0]?.profilePic == ""
                    ? blank_profile_img
                    : User_information[0]?.profilePic
                }
                alt=""
              />
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};
