import React, { useContext, useEffect, useRef, useState } from "react";
import { FaUserCircle, FaTrash, FaEye } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import profile from "../../../assets/Images/profile.jpg";
import { IoSearch } from "react-icons/io5";
import { Backend_Path } from "../../../Backend_Path";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import { NavLink } from "react-router-dom";
import axios from "axios";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { TbAccessibleFilled } from "react-icons/tb";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../../../soket";
import { Loader } from "../../Loader/Loader";
export const ConnectionInner = () => {
  const [allUser, setallUser] = useState([]);
  const [allready_requested_Data, setallready_requested_Data] = useState([]);
  const [RenderStatelocal, setRenderStatelocal] = useState(1);
  const [send_Request, setsend_Request] = useState();
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const [userStatus, setuserStatus] = useState();
  const { setre_RenderState } = useContext(BranchStoreApi);
  const SearchBoxState = useRef("");
  const [Soketio_friend_Request, setSoketio_friend_Request] = useState([]);
  const Local_Storage_Id = localStorage.getItem("id");
  useEffect(() => {
    const FetchFunction = async () => {
      setisLoaderOpen(true);
      try {
        // ================Who are Send Friend Request this API===========
        const Friend_Requested_Data_Recever = await fetch(
          `${Backend_Path()}/home/friend-recever-data${Local_Storage_Id}`
        );
        const Friend_Requested_Recever_Data_Response =
          await Friend_Requested_Data_Recever.json();

        const Array_Only_Id = [];
        Friend_Requested_Recever_Data_Response[0]?.sender_id.map((item) => {
          Array_Only_Id.push(item.id);
        });
        // console.log(Array_Only_Id);
        setsend_Request(Array_Only_Id);

        const Friend_Requested_Data = await fetch(
          `${Backend_Path()}/home/friend-requested-data${Local_Storage_Id}`
        );
        const Friend_Requested_Data_Response =
          await Friend_Requested_Data.json();
        setallready_requested_Data(Friend_Requested_Data_Response);
        const Allrady_FriendData = await axios.get(
          `${Backend_Path()}/home/find-user-friends${Local_Storage_Id}`
        );
        let Object_to_array_Converter = [];
        Allrady_FriendData.data.friends.map((item) =>
          Object_to_array_Converter.push(item.id)
        );
        const FetchData = await fetch(`${Backend_Path()}/home/find-all-user`);
        const Response = await FetchData.json();
        const Filter_Who_are_Already_Friend = Response.filter((item) => {
          return !Object_to_array_Converter.includes(item.user_id);
        });
        const Filter_remove_Own_Account = Filter_Who_are_Already_Friend.filter(
          (item) => {
            return item.user_id != Local_Storage_Id;
          }
        );
        setallUser(Filter_remove_Own_Account);
        setisLoaderOpen(false);
      } catch (err) {
        console.log(err);
        setisLoaderOpen(false);
      }
    };
    FetchFunction();
  }, [RenderStatelocal]);
  const Friend_Request_Send = async (user_id, type) => {
    const Local_Storage_Id = localStorage.getItem("id");
    try {
      setisLoaderOpen(true);
      if (type == "add") {
        const Data = await axios.post(
          `${Backend_Path()}/home/friend-request-send`,
          {
            sender_id: Local_Storage_Id,
            recever_id: user_id,
            status: "Panding",
          }
        );
        // ===============Transfer Frend_Request On Soket io===========
        socket.emit("user_friend_request", {
          sender_id: Local_Storage_Id,
          recever_id: user_id,
          type: "add-friend",
        });
        toast.success("Request Send Successfully");
      } else if (type == "accept") {
        axios.post(`${Backend_Path()}/home/friend-request-accept`, {
          sender_id: user_id,
          recever_id: Local_Storage_Id,
        });
        // ===============Transfer Frend_Request On Soket io===========
        socket.emit("user_friend_request", {
          sender_id: Local_Storage_Id,
          recever_id: user_id,
          type: "accept-friend",
        });
        setre_RenderState((prev) => prev + 1);
      } else {
        const Data = await axios.post(
          `${Backend_Path()}/home/cancle-friend-request`,
          {
            sender_id: Local_Storage_Id,
            recever_id: user_id,
          }
        );
        // ===============Transfer Frend_Request On Soket io===========
        socket.emit("user_friend_request", {
          sender_id: Local_Storage_Id,
          recever_id: user_id,
          type: "cancle-friend",
        });
        toast.success("Request Cancle Successfully");
      }
      setRenderStatelocal((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };
  const SearchBoxFunction = async (e) => {
    const newValue = e.target.value;
    SearchBoxState.current = newValue;
    try {
      setisLoaderOpen(true);
      setTimeout(async () => {
        const Allrady_FriendData = await axios.get(
          `${Backend_Path()}/home/find-user-friends${Local_Storage_Id}`
        );
        let Object_to_array_Converter = [];
        Allrady_FriendData.data.friends.map((item) =>
          Object_to_array_Converter.push(item.id)
        );
        // console.log(SearchBoxState);

        const SearchData = await axios.post(
          `${Backend_Path()}/home/connection-part-searchbox`,
          { name: SearchBoxState.current }
        );
        const Filter_Who_are_Already_Friend = SearchData.data.filter((item) => {
          return !Object_to_array_Converter.includes(item.user_id);
        });
        const Filter_remove_Own_Account = Filter_Who_are_Already_Friend.filter(
          (item) => {
            return item.user_id != Local_Storage_Id;
          }
        );
        setallUser(Filter_remove_Own_Account);
        setisLoaderOpen(false);
        // console.log(SearchData.data);
      }, [500]);
    } catch (err) {
      setisLoaderOpen(false);
      console.log(err);
    }
  };
  useEffect(() => {
    socket.emit("get_online_users");
    socket.on("user_online", (data) => {
      // console.log(data);
      setuserStatus(data);
    });
    socket.on("user_friend_request_frontend", (data) => {
      if (data.recever_id == localStorage.getItem("id"))
        setRenderStatelocal((prev) => prev + 1);
    });
  }, [socket]);
  return (
    <>
      <div className="w-full h-fit fixed md:px-[17em] left-0 p-2 pb-0 bg-[#f0f2f5] z-10">
        <h1 className="text-3xl font-bold mb-4 mt-4 text-center text-teal-600">
          Search your Friends
        </h1>
        <div class="flex rounded-md border-2 mb-4 border-blue-500 overflow-hidden w-full">
          <input
            type="email"
            placeholder="Enter Name..."
            name="name"
            class="w-full outline-none bg-white text-gray-600 text-md px-4 py-2"
            onChange={(e) => SearchBoxFunction(e)}
            value={SearchBoxState.current}
          />
          <button
            type="button"
            class="flex items-center justify-center bg-[#007bff] px-5"
          >
            <IoSearch className="text-white text-xl" />
          </button>
        </div>
      </div>
      <div className="w-full mt-[18vh] md:mt-[21vh] text-gray-500">
        {/* ============Loader Start============ */}
        <Loader isLoaderOpen={isLoaderOpen} />
        {/* ============Loader End============ */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className={`h-fit flex md:flex-row items-center justify-center flex-col gap-4`}>
              {allUser.length == 0 && !isLoaderOpen
                ? "Record Not Found"
                : allUser.map((user) => (
                    <div
                      key={user._id}
                      className="bg-white rounded-lg w-full md:w-fit shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                    >
                      <div className="p-4">
                        <img
                          src={
                            user?.profilePic == ""
                              ? blank_profile_img
                              : user?.profilePic
                          }
                          alt="Loading..."
                          className="w-24 relative h-24 rounded-full mx-auto mb-4 object-cover"
                        />

                        <h2 className="text-xl font-semibold text-center text-black">
                          {user.name}
                        </h2>
                        <div className="w-full flex items-center justify-center flex-col text-sm">
                          <p>{user.bio}</p>
                          <p
                            className={`inline-block px-2 py-1 text-center text-xs mb-2 mt-2 font-semibold rounded-full ${
                              userStatus?.includes(user.user_id)
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-gray-200"
                            }`}
                          >
                            {userStatus?.includes(user.user_id)
                              ? "Online"
                              : "Offline"}
                          </p>
                        </div>
                        <div className="flex justify-center space-x-2">
                          <NavLink
                            className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-2 text-center flex gap-1 items-center"
                            to={"/view-other-profile"}
                            state={{
                              user_id: user.user_id,
                              user_friend_request: allready_requested_Data,
                            }}
                          >
                            <FaEye />
                            View Profile
                          </NavLink>

                          {send_Request.includes(user.user_id) ? (
                            <button
                              type="button"
                              class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l font-medium rounded-lg text-sm flex items-center justify-center px-2 py-2 gap-1 text-center"
                              onClick={() =>
                                Friend_Request_Send(user.user_id, "accept")
                              }
                            >
                              <TbAccessibleFilled />
                              Accept
                            </button>
                          ) : allready_requested_Data[0]?.recever_id?.some(
                              (item) => item.id === user.user_id
                            ) ? (
                            <button
                              type="button"
                              class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br  shadow-lg shadow-red-500/50 dark:shadow-lg font-medium rounded-lg text-sm px-3 py-2 gap-1 text-center flex items-center"
                              onClick={() =>
                                Friend_Request_Send(user.user_id, "cancle")
                              }
                            >
                              <IoPersonRemoveSharp />
                              Cancle
                            </button>
                          ) : (
                            <button
                              className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm flex items-center justify-center px-2 py-2 gap-1 text-center"
                              onClick={() =>
                                Friend_Request_Send(user.user_id, "add")
                              }
                            >
                              <IoPersonAdd />
                              Add Friend
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
