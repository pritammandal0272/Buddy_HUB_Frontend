import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaSms } from "react-icons/fa";
import { Backend_Path } from "../../../Backend_Path";
import axios from "axios";
import socket from "../../../soket";
export const Navbar_Messenger = () => {
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
      // console.log(FetchData);

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
  useEffect(() => {
    socket.on("receved_notification", (data) => {
      if (data.recever_id == localStorage.getItem("id"))
        setRe_renderState((prev) => prev + 1);
      // console.log(data);
    });
  }, [socket]);
  return (
    <NavLink
      to={"/messenger"}
      className={({ isActive }) => {
        return isActive
          ? `h-10 w-10 bg-blue-200 rounded-lg  flex items-center justify-center text-[25px] text-blue-600 scale-110 transition-all duration-300 ease-in-out`
          : `h-10 w-10 relative flex items-center justify-center text-[25px]`;
      }}
    >
      <FaSms className="text-[#007bff]" />
      {CountNotification == 0 ? null : (
        <div className=" rounded-full flex items-center justify-center text-white border border-black -top-0.5 -right-0
        "
          style={{backgroundColor:"red",position:"absolute",height:"15px",width:"14px",fontSize:"12px"}}
        >
          {CountNotification}
        </div>
      )}
    </NavLink>
  );
};
