import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Backend_Path } from "../../../Backend_Path";
import { IoIosNotifications } from "react-icons/io";
import socket from "../../../soket";
export const Navbar_Notifications = () => {
  const [countNotifications, setcountNotifications] = useState();
  const [renderState, setrenderState] = useState(1);
  useEffect(() => {
    const FetchReceverDatafunction = async () => {
      try {
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
        setcountNotifications(Array_Only_Id);
        // console.log();
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
  return (
    <NavLink
      to={"/notifications"}
      className={({ isActive }) => {
        return isActive
          ? `h-9 border-b-4 rounded-lg border-purple-500 font-semibold cursor-pointer  w-10 bg-blue-200   flex items-center justify-center text-[20px] text-blue-600 scale-110 transition-all duration-100 ease-in-out`
          : "h-9 w-10 bg-slate-300 rounded-lg flex items-center justify-center text-[20px] text-gray-600 relative";
      }}
    >
      <div
        class={`absolute inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-1 dark:border-gray-900 transition-all   duration-300 ease-in-out ${
          countNotifications?.length == 0
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        {countNotifications?.length}
      </div>
      <IoIosNotifications />
    </NavLink>
  );
};
