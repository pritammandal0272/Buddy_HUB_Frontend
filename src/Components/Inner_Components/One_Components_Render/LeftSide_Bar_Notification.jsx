import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Backend_Path } from "../../../Backend_Path";
import socket from "../../../soket";
export const LeftSide_Bar_Notification = ({ Notifiction_Img }) => {
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
        if (isActive) {
          return "text-blue-600 scale-110 transition-all duration-100 ease-in-out ml-2";
        }
      }}
    >
      <div className="flex items-center gap-1 text-[16px] font-semibold">
        <img src={Notifiction_Img} alt="" className="h-[21px] w-[21px]" />
        Notifications
        <div
          class={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full shadow-xl transition-all duration-300 ease-in-out ${
            countNotifications?.length == 0
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          }`}
        >
          {countNotifications?.length}
        </div>
      </div>
    </NavLink>
  );
};
