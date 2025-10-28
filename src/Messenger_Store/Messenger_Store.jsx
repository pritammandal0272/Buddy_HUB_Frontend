import React, { createContext, useEffect, useState } from "react";
export const Messenger_Store_Context = createContext();
import toast, { Toaster } from "react-hot-toast";
import { Backend_Path } from "../Backend_Path";
import socket from "../soket";
import { useRef } from "react";
const Messenger_Store = ({ children }) => {
  const [Messenger_User_Content, setMessenger_User_Content] = useState("home");
  const [RoomIdState, setRoomIdState] = useState();
  const [Chatall_Data, setChatall_Data] = useState([]);
  const [userStatus, setuserStatus] = useState();
  const for_Room_Leave_User_Id = useRef(null);
  const RoomIdRef = useRef({ ROOM_ID: "" });
  const [
    SeenSms_Re_render_Sidebar_notification,
    setSeenSms_Re_render_Sidebar_notification,
  ] = useState(1);

  const [ResponsiveState, setResponsiveState] = useState(false);

  // ====================Select & Room Id Create=====================
  const SeleteUser = async (user) => {
    // ================ For Messenger Back Button Press Start==============
    setResponsiveState(true);
    for_Room_Leave_User_Id.current = user.user_id;
    window.history.pushState({ selected: true }, "");
    // ================For Messenger Back Button Press End==============
    const RoomId = [localStorage.getItem("id"), user.user_id].sort().join("_");
    setRoomIdState(RoomId);
    RoomIdRef.current.ROOM_ID = RoomId;
    socket.emit("select_user_join_room", {
      RoomId: RoomId,
      user_id: localStorage.getItem("id"),
      recever_id: user.user_id,
    });
    socket.emit("seen_message", {
      RoomId: RoomId,
      recever_id: localStorage.getItem("id"),
    });
    try {
      const FetchOld_ChatData = await fetch(
        `${Backend_Path()}/messenger/find-chat${RoomId}`
      );
      const Response_FetchOld_ChatData = await FetchOld_ChatData.json();
      setChatall_Data(Response_FetchOld_ChatData);
    } catch (err) {
      setChatall_Data([]);
      console.log(err);
    }
    if (
      Messenger_User_Content != "home" &&
      Messenger_Store_Context?.user_id != user.user_id
    ) {
      socket.emit("leave_room", localStorage.getItem("id"));
    }
    setSeenSms_Re_render_Sidebar_notification((prev) => prev + 1);
    setMessenger_User_Content(user);
  };
  // ================Messenger Back Button Press Start==============
  useEffect(() => {
    const backButtonPress = () => {
      setResponsiveState(false);
      socket.emit("leave_room", localStorage.getItem("id"));
      setMessenger_User_Content("home");
    };
    // console.log(for_Room_Leave_User_Id.current);
    window.addEventListener("popstate", backButtonPress);
    return () => window.removeEventListener("popstate", backButtonPress);
  }, [ResponsiveState]);
  // ================Messenger Back Button Press End==============

  // ===============Send Messages===================
  const Send_Message = (message) => {
    // ================Time Calculate Start=============
    const Hours = new Date().getHours();
    let time = "";
    if (Hours > 11) {
      time += (Hours % 12) + ":" + new Date().getMinutes() + " " + "PM";
    } else {
      time += Hours + ":" + new Date().getMinutes() + " " + "AM";
    }
    // ================Time Calculate End=============
    if (message === "") {
      toast.error("Enter message");
    } else {
      socket.emit("send_message", {
        room_id: RoomIdState,
        sender_id: localStorage.getItem("id"),
        recever_id: Messenger_User_Content.user_id,
        message: message,
        time: time,
      });
      // setSeenSms_Re_render_Sidebar_notification((prev) => prev + 1);
    }
  };
  useEffect(() => {
    // console.log();
    console.log(Chatall_Data);
    socket.on("receved_message", (Data) => {
      console.log("Pritam: ", RoomIdRef.current.ROOM_ID);
      if (Data.room_id == RoomIdRef.current.ROOM_ID) {
        setChatall_Data((prev) => [
          ...prev,
          {
            sender_id: Data.sender_id,
            chat: Data.message,
            deleverd: Data.deleverd,
            time: Data.time,
            seen: Data.seen,
          },
        ]);
        socket.on("message_seen", ({ room_id, user_id }) => {
          setChatall_Data((prev) =>
            prev.map((msg) =>
              msg.sender_id !== user_id ? { ...msg, seen: true } : msg
            )
          );
        });
      }
    });
    // ===========For User Online Start=============
    socket.emit("get_online_users");
    socket.on("user_online", (data) => {
      // console.log("Online User: ", data);
      setuserStatus(data);
    });
    // ===========For User Online End=============
  }, [socket]);
  // console.log(location);
  useEffect(() => {
    return () => {
      if (!location.pathname.startsWith("/messenger")) {
        socket.emit("leave_room", localStorage.getItem("id"));
      }
    };
  }, [location]);
  // =================Leave User on Room When page Refreshing================
  useEffect(() => {
    const RefreshFunction = () => {
      socket.emit("leave_room", localStorage.getItem("id"));
    };
    window.addEventListener("beforeunload", RefreshFunction);
    return () => window.removeEventListener("beforeunload", RefreshFunction);
  }, []);
  return (
    <>
      <Messenger_Store_Context.Provider
        value={{
          SeleteUser,
          Messenger_User_Content,
          setMessenger_User_Content,
          Send_Message,
          Chatall_Data,
          setResponsiveState,
          ResponsiveState,
          setuserStatus,
          userStatus,
          setSeenSms_Re_render_Sidebar_notification,
          SeenSms_Re_render_Sidebar_notification,
        }}
      >
        {children}
      </Messenger_Store_Context.Provider>
    </>
  );
};
export default Messenger_Store;
