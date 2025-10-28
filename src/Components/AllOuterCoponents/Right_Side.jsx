import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Right_Side_Bar_Messenger } from "../Inner_Components/Right_Side_Bar/Right_Sidebar_Messenger";
import blank_profile_img from "../../assets/Images/black_profile.jpg";
import { FaEye } from "react-icons/fa";
import { Backend_Path } from "../../Backend_Path";
import axios from "axios";
import { BranchStoreApi } from "../../BranchStore/BranchStore";
import socket from "../../soket";
import { motion, AnimatePresence } from "framer-motion";

export const Right_Side_Bar = () => {
  const [allUser, setallUser] = useState();
  const [allready_requested_Data, setallready_requested_Data] = useState([]);
  const [send_Request, setsend_Request] = useState();
  const [RenderStatelocal, setRenderStatelocal] = useState();
  const { re_RenderState } = useContext(BranchStoreApi);
  useEffect(() => {
    const FetchFunction = async () => {
      const Local_Storage_Id = localStorage.getItem("id");
      try {
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
      } catch (err) {
        console.log(err);
      }
    };
    FetchFunction();
  }, [re_RenderState, RenderStatelocal]);
  useEffect(() => {
    console.log("");
  }, [allUser]);
  useEffect(() => {
    socket.on("user_friend_request_frontend", (data) => {
      if (data.recever_id == localStorage.getItem("id"))
        setRenderStatelocal((prev) => prev + 1);
    });
  }, [socket]);
  return (
    <>
      <div className="hidden w-[17em] z-20 pt-[9vh] h-[100vh]  fixed px-4 right-0 md:flex flex-col gap-2 justify-between pb-3 bg-[#f0f2f5]">
        <div className="w-full max-w-lg relative  bg-white rounded-md shadow  flex flex-col py-2 px-2 h-[50%]">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h1 className="pb-3 text-3xl sm:text-xl font-bold text-center text-green-500">
                New Member
              </h1>
              {/* <!--User row --> */}
              {allUser?.length > 0 ? (
                allUser?.map((user, index) => {
                  return index < 3 ? (
                    <div
                      key={index}
                      className="user-row flex flex-col items-center justify-between cursor-pointer  duration-300  sm:flex-row hover:bg-[#f6f8f9]"
                    >
                      <div className="user flex items-center text-center flex-col w-full sm:flex-row sm:text-left">
                        <div className="avatar-content w-full">
                          <Link
                            to={"/view-other-profile"}
                            state={{
                              user_id: user.user_id,
                              user_friend_request: allready_requested_Data,
                            }}
                            className="user-body flex mb-4 w-full"
                          >
                            <div className="w-[25%]">
                              <img
                                className="w-12 h-12 rounded-full"
                                src={
                                  user?.profilePic == ""
                                    ? blank_profile_img
                                    : user?.profilePic
                                }
                              />
                            </div>
                            <div className="title font-medium no-underline w-[60%]">
                              <p className="w-30 h-5 overflow-hidden text-ellipsis whitespace-nowrap break-words">
                                {user?.name}
                              </p>
                              <p className="w-28 h-5 overflow-hidden text-ellipsis whitespace-nowrap break-words text-gray-400 text-[14px]">
                                {user?.bio}
                              </p>
                            </div>
                            <div className="mx-auto w-[15%] py-2">
                              <div className="bg-[#3b82f650]  w-full h-full rounded-full flex text-blue-700 items-center justify-center">
                                <FaEye />
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })
              ) : (
                <div className="h-full absolute top-0 w-full flex items-center justify-center">
                  <p className="text-center text-gray-400">No record found</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          {allUser?.length > 0 ? (
            <Link
              to={"/connections"}
              className="flex absolute bottom-2 items-center justify-center bg-[#3b82f630] text-blue-700 rounded-[20em] py-2 w-fit px-5 left-6"
            >
              <p> Show more members</p>
            </Link>
          ) : null}
        </div>

        {/* News Part */}
        <Right_Side_Bar_Messenger />
      </div>
    </>
  );
};
