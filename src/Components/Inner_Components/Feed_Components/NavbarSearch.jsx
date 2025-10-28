import React, { useReducer, useRef, useState } from "react";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import "../../../assets/Styles/style.css";
import { GiArchiveResearch } from "react-icons/gi";
import { FaMicrophoneLines } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import axios, { all } from "axios";
import { Backend_Path } from "../../../Backend_Path";
import { Link } from "react-router-dom";
export const NavbarScarchbar = ({
  NavbarMobileSearchAnimation,
  setNavbarMobileSearchAnimation,
}) => {
  const SearchBoxState = useRef("");
  const [OpenSearchBox, setOpenSearchBox] = useState(false);
  const [allUser, setallUser] = useState("");
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const SearchBoxFunction = async (e) => {
    const newValue = e.target.value;
    SearchBoxState.current = newValue;
    try {
      if (SearchBoxState.current != "") {
        setisLoaderOpen(true);
        // const Allrady_FriendData = await axios.get(
        //   `${Backend_Path()}/home/find-user-friends${localStorage.getItem(
        //     "id"
        //   )}`
        // );
        // let Object_to_array_Converter = [];
        // Allrady_FriendData.data.friends.map((item) =>
        //   Object_to_array_Converter.push(item.id)
        // );
        const SearchData = await axios.post(
          `${Backend_Path()}/home/connection-part-searchbox`,
          { name: SearchBoxState.current }
        );
        // console.log(SearchData);
        // const Filter_Who_are_Already_Friend = SearchData.data.filter((item) => {
        //   return !Object_to_array_Converter.includes(item.user_id);
        // });
        const Filter_remove_Own_Account = SearchData.data.filter((item) => {
          return (
            item.user_id != localStorage.getItem("id") &&
            SearchBoxState.current != ""
          );
        });
        setallUser(Filter_remove_Own_Account);
        setisLoaderOpen(false);
      } else {
        setallUser([]);
      }
    } catch (err) {
      setallUser([]);
      setisLoaderOpen(false);
      console.log(err);
    }
  };
  return (
    <>
      <div
        className={`md:flex md:w-[90%] md:opacity-100 items-center max-w-lg mx-auto transition-all duration-500 ease-in-out relative ${
          NavbarMobileSearchAnimation
            ? " w-[90%] opacity-100"
            : " w-0 opacity-0"
        }`}
      >
        <div
          className={`absolute w-full flex-col ransition-all duration-500 ease-in-out z-[500] max-h-[50vh] overflow-scroll Scroll bg-white p-2 shadow-md top-14 rounded-b-md ${
            OpenSearchBox && SearchBoxState?.current != ""
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {allUser?.length == 0 ? (
            <p className="w-full text-sm text-center text-gray-500">
              No record found
            </p>
          ) : (
            allUser?.map((user) => {
              return (
                <Link
                  key={user?._id}
                  className="flex hover:bg-slate-200 transition-all duration-300 ease-in-out rounded-md p-2 h-fit w-full items-center gap-2 cursor-pointer border-b"
                  to={"/view-other-profile"}
                  state={{
                    user_id: user?.user_id,
                  }}
                >
                  <img
                    src={
                      user?.profilePic == ""
                        ? blank_profile_img
                        : user?.profilePic
                    }
                    alt="Loading..."
                    className="w-11 relative h-11 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-center text-black">
                      {user?.name}
                    </h2>
                    <p
                      className={`py-0.5 -mt-1 px-2 w-fit text-center text-[11px] font-semibold rounded-full ${
                        user?.online
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {user?.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
        <div
          className={`flex rounded-md mt-4 relative border-2 mb-4 z-[1000] border-blue-500 overflow-hidden w-full`}
        >
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <GiArchiveResearch className="text-xl text-gray-500" />
          </div>
          <input
            type="text"
            id="voice-search"
            value={SearchBoxState.current}
            className="bg-gray-50 focus:outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  "
            placeholder="Search People, Enter Name..."
            onBlur={() => {
              setTimeout(() => {
                setOpenSearchBox(false);
                setallUser([]);
                setNavbarMobileSearchAnimation(false);
                SearchBoxState.current = "";
              }, 300);
            }}
            onChange={(e) => {
              SearchBoxFunction(e);
              setOpenSearchBox(true);
            }}
            required
          />
          <button
            type="button"
            class="flex items-center justify-center bg-[#007bff] px-5"
          >
            <IoSearch className="text-white text-xl" />
          </button>
        </div>
      </div>
    </>
  );
};
