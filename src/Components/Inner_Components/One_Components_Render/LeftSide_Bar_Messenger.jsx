import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import socket from "../../../soket";
import { Backend_Path } from "../../../Backend_Path";
import axios from "axios";
export const LeftSide_Bar_Messenger = ({ Events_Img }) => {
  const [allRequstedInformation, setallRequstedInformation] = useState([]);
  const [CountNotification, setCountNotification] = useState();
  const [Re_renderState, setRe_renderState] = useState(1);
  useEffect(() => {
    const LocalHostId = localStorage.getItem("id");
    const FetchFunction = async () => {
      const FetchData = await fetch(
        `${Backend_Path()}/home/find-user-friends${LocalHostId}`
      );
      const Response = await FetchData.json();
      // console.log(Response.friends);
      const Array_Only_Id = [];
      Response.friends.map((item) => {
        Array_Only_Id.push(item.id);
      });

      const Find_RecerverInformation_information_Model = await axios.post(
        `${Backend_Path()}/home/friend-recever-data-information-model`,
        Array_Only_Id
      );
      // console.log(Find_RecerverInformation_information_Model.data);
      setallRequstedInformation(
        Find_RecerverInformation_information_Model.data
      );
    };
    FetchFunction();
  }, []);
  useEffect(() => {
    const FetchFunction = async (index) => {
      const RoomId = [
        localStorage.getItem("id"),
        allRequstedInformation[index]?.user_id,
      ]
        .sort()
        .join("_");

      const FetchData = await axios.get(
        `${Backend_Path()}/messenger/chat-notification${RoomId}`
      );

      const Count = FetchData.data.filter(
        (item) => item.sender_id !== localStorage.getItem("id") && !item.seen
      );

      if (Count[0]?.sender_id !== undefined) {
        return Count.length;
      } else {
        return 0;
      }
    };

    const runFetch = async () => {
      let CountNoti = 0;
      for (let i = 0; i < allRequstedInformation.length; i++) {
        const res = await FetchFunction(i);
        CountNoti += res;
      }
      //   console.log("Fresh: ", CountNoti);

      setCountNotification(CountNoti);
    };
    runFetch();
  }, [allRequstedInformation, location.pathname, Re_renderState]);
  useEffect(() => {
    socket.on("home_notification_messenger", (data) => {
      setRe_renderState((prev) => prev + 1);
      //   console.log(data);
    });
  }, [socket]);
  return (
    <NavLink
      to={"/messenger"}
      className={({ isActive }) => {
        if (isActive) {
          return "text-blue-600 scale-110 transition-all duration-100 ease-in-out ml-2";
        }
      }}
    >
      <div className="flex items-center gap-1 text-[16px] font-semibold">
        <img src={Events_Img} alt="" className="h-[22px] w-[22px]" />
        Messenger
        <div
          class={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full shadow-lg transition-all duration-300 ease-in-out ${
            CountNotification == 0
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          }`}
        >
          {CountNotification}
        </div>
      </div>
    </NavLink>
  );
};
