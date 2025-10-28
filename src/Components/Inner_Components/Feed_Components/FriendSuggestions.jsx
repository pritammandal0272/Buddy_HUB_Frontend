import React from "react";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import "../../../assets/Styles/style.css";
import { IoPeopleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Backend_Path } from "../../../Backend_Path";
import axios from "axios";
import { useContext } from "react";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { TbAccessibleFilled } from "react-icons/tb";
import { FaUserCircle, FaTrash, FaEye } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import socket from "../../../soket";
import toast from "react-hot-toast";
import { ConnectionButtonLoader } from "../ConnectionInner/ConnectionButtonLoader";
export const FriendSuggestions = ({ item }) => {
  const [allready_requested_Data, setallready_requested_Data] = useState([]);
  const [RenderStatelocal, setRenderStatelocal] = useState(1);
  const [send_Request, setsend_Request] = useState();
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const { setre_RenderState } = useContext(BranchStoreApi);
  const Local_Storage_Id = localStorage.getItem("id");
  useEffect(() => {
    const FetchFunction = async () => {
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
        setsend_Request(Array_Only_Id);
        const Friend_Requested_Data = await fetch(
          `${Backend_Path()}/home/friend-requested-data${Local_Storage_Id}`
        );
        const Friend_Requested_Data_Response =
          await Friend_Requested_Data.json();
        setallready_requested_Data(Friend_Requested_Data_Response);
      } catch (err) {
        console.log(err);
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
  return (
    <>
      <div className="w-full flex-col flex gap-4 Scroll overflow-x-auto bg-white rounded-md shadow-md p-4 pb-0 h-fit mb-4">
        <h1 className="font-semibold flex items-center gap-1 text-lg">
          <IoPeopleOutline className="text-xl" />
          People you may Know
        </h1>
        <div className="w-full flex pb-4 gap-4 Scroll overflow-x-auto">
          {/* {console.log(item)} */}

          {Array.isArray(item)
            ? item?.map((user) => {
                return (
                  <div class="max-w-sm shrink-0 overflow-hidden h-[18em] bg-white border-gray-200 rounded-xl shadow-md border">
                    <img
                      class="rounded-t-lg"
                      src={
                        user?.profilePic == ""
                          ? blank_profile_img
                          : user?.profilePic
                      }
                      className=" h-[65%] w-full"
                      alt=""
                    />
                    <div class="p-2 h-[35%] flex justify-between flex-col">
                      <h1 className="text-lg font-semibold">{user?.name}</h1>
                      <p className="text-[12px] w-40 -mt-2 h-5 overflow-hidden text-ellipsis whitespace-nowrap break-words text-gray-400">
                        {user?.bio}
                      </p>
                      <div class="flex justify-between">
                        {send_Request?.includes(user.user_id) ? (
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
                        <Link
                          to={"/view-other-profile"}
                          state={{
                            user_id: user?.user_id,
                          }}
                          class="py-2 px-2 flex items-center gap-1 ms-2 text-[12px] font-medium text-gray-900 focus:outline-none rounded-lg border  bg-gray-200"
                        >
                          <FaEye />
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </>
  );
};
