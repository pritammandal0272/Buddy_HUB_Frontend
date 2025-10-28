import React, { useContext, useEffect, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { Backend_Path } from "../../Backend_Path";
import blank_profile_img from "../../assets/Images/black_profile.jpg";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { BranchStoreApi } from "../../BranchStore/BranchStore";
import toast, { Toaster } from "react-hot-toast";
import socket from "../../soket";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "../Loader/Loader";

export const Notifications = () => {
  const { LoaderState } = useContext(BranchStoreApi);
  const Local_Storage_Id = localStorage.getItem("id");
  const [allNotifications, setallNotifications] = useState();
  const [renderState, setrenderState] = useState(1);
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  useEffect(() => {
    const FetchReceverDatafunction = async () => {
      try {
        setisLoaderOpen(true);
        const Local_Storage_Id = localStorage.getItem("id");
        const Friend_Requested_Data = await fetch(
          `${Backend_Path()}/home/friend-recever-data${Local_Storage_Id}`
        );
        const Friend_Requested_Recever_Data_Response =
          await Friend_Requested_Data.json();
        const Array_Only_Id = [];
        Friend_Requested_Recever_Data_Response[0]?.sender_id.map((item) => {
          Array_Only_Id.push(item.id);
        });
        const Find_RecerverInformation_information_Model = await axios.post(
          `${Backend_Path()}/home/friend-recever-data-information-model`,
          Array_Only_Id
        );
        setallNotifications(Find_RecerverInformation_information_Model.data);
        setisLoaderOpen(false);
      } catch (err) {
        console.log(err);
      }
    };
    FetchReceverDatafunction();
  }, [renderState]);
  useEffect(() => {
    socket.on("user_friend_request_frontend", (data) => {
      setrenderState((prev) => prev + 1);
    });
  }, [socket]);

  const Accept_Feiend_Request = async (user_id) => {
    try {
      setisLoaderOpen(true);
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
      setrenderState((prev) => prev + 1);
      toast.success("Request Accept Successfully");
      setisLoaderOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };
  const Cancle_Friend_Request_Send = async (user_id) => {
    try {
      setisLoaderOpen(true);
      const Data = await axios.post(
        `${Backend_Path()}/home/cancle-friend-request`,
        {
          sender_id: user_id,
          recever_id: Local_Storage_Id,
        }
      );
      // ===============Transfer Frend_Request On Soket io===========
      socket.emit("user_friend_request", {
        sender_id: Local_Storage_Id,
        recever_id: user_id,
        type: "cancle-friend",
      });
      setrenderState((prev) => prev + 1);
      setisLoaderOpen(false);
      toast.success("Request Cancle Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };
  return (
    <>
      <div className=" w-full h-full pt-[13vh] md:pt-[8vh] md:px-[17em]">
        {/* <!-- component --> */}
        <Toaster />
        <Loader isLoaderOpen={isLoaderOpen} />
        {allNotifications?.length == 0 && !isLoaderOpen ? (
          <div className="w-full  mt-5 flex items-center justify-center text-gray-500">
            <p>No record Found</p>
          </div>
        ) : (
          allNotifications?.map((user) => {
            return (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div class="flex h-fit bg-gray-100 mt-2 w-full">
                    <div class="bg-white rounded-lg shadow-md border p-4 w-full">
                      <div class="mb-4">
                        <h1 class="font-semibold text-gray-800">
                          Friend Requests
                        </h1>
                      </div>
                      <div class="flex gap-2">
                        <div>
                          <NavLink
                            to={"/view-other-profile"}
                            state={{ user_id: user.user_id }}
                          >
                            <img
                              class="w-12 h-12 rounded-full border border-gray-100 shadow-sm"
                              src={
                                user?.profilePic == ""
                                  ? blank_profile_img
                                  : user?.profilePic
                              }
                              alt="user image"
                              // onClick={() => View_User_Profile(user.user_id)}
                            />
                          </NavLink>
                        </div>
                        <div class="w-4/5">
                          <div>
                            <NavLink
                              to={"/view-other-profile"}
                              state={{ user_id: user.user_id }}
                            >
                              <span class="font-semibold text-gray-800">
                                {user.name}
                              </span>
                            </NavLink>
                          </div>
                          <span class="text-gray-400">
                            wants to be your friend
                          </span>
                        </div>
                        <div
                          className="w-10 h-10 bg-[#4ade80] rounded-full flex items-center justify-center text-2xl text-white cursor-pointer hover:bg-[#02f35a]"
                          onClick={() => Accept_Feiend_Request(user.user_id)}
                        >
                          {LoaderState ? (
                            <svg
                              aria-hidden="true"
                              role="status"
                              class="w-5 h-5 text-white animate-spin flex items-center justify-center"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#E5E7EB"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentColor"
                              />
                            </svg>
                          ) : (
                            <IoMdCheckmark />
                          )}
                        </div>
                        <div
                          className="w-10 h-10 bg-[#de4a5e] rounded-full flex items-center justify-center text-xl text-white cursor-pointer hover:bg-[#ff0022]"
                          onClick={() =>
                            Cancle_Friend_Request_Send(user.user_id)
                          }
                        >
                          <FaXmark />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            );
          })
        )}
      </div>
    </>
  );
};
