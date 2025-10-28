import React, { useContext, useEffect, useState } from "react";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import axios from "axios";
import { Backend_Path } from "../../../Backend_Path";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import { Link } from "react-router-dom";
import { Messenger_Store_Context } from "../../../Messenger_Store/Messenger_Store";
import socket from "../../../soket";
import { motion, AnimatePresence } from "framer-motion";
export const Right_Side_Bar_Messenger = () => {
  const [userStatus, setuserStatus] = useState();
  const { re_RenderState } = useContext(BranchStoreApi);
  const [allRequstedInformation, setallRequstedInformation] = useState([]);
  const [RenderStatelocal, setRenderStatelocal] = useState([]);
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
  }, [re_RenderState, RenderStatelocal]);
  useEffect(() => {
    console.log("Rerender");
  }, [allRequstedInformation, re_RenderState]);
  useEffect(() => {
    socket.emit("get_online_users");
    socket.on("user_online", (data) => {
      // console.log(data);
      setuserStatus(data);
      socket.on("user_friend_request_frontend", (data) => {
        if (data.recever_id == localStorage.getItem("id"))
          setRenderStatelocal((prev) => prev + 1);
      });
    });
  }, [socket]);
  return (
    <div className="w-full max-w-lg bg-white rounded-md shadow-xl flex flex-col relative h-[50%] justify-between border-2">
      <div className="p-2 cursor-pointer">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-center text-2xl font-semibold text-green-500">
              Messenger
            </p>
            {allRequstedInformation?.length > 0 ? (
              allRequstedInformation?.map((user, index) => {
                return index < 3 ? (
                  <Link
                    to={"/messenger"}
                    key={index}
                    state={{ user: user }}
                    className="flex items-center gap-2 p-2"
                  >
                    <div className="relative">
                      <img
                        src={
                          user?.profilePic == ""
                            ? blank_profile_img
                            : user?.profilePic
                        }
                        alt="Contact 1"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold">
                        {user.name}
                      </h3>
                      <p
                        className={`text-sm text-muted-foreground ${
                          userStatus?.includes(user.user_id)
                            ? "text-blue-400"
                            : "text-gray-400"
                        }`}
                      >
                        {userStatus?.includes(user.user_id)
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </Link>
                ) : null;
              })
            ) : (
              <div className="h-full mt-28 w-full flex items-center justify-center">
                <p className="text-center text-gray-400">
                  You don't have any friends
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {allRequstedInformation?.length > 0 ? (
          <Link
            to={"/messenger"}
            className="flex items-center absolute bottom-3 justify-center bg-[#3b82f630] text-blue-700 rounded-[20em] py-2 w-[90%] left-3"
          >
            <p> Show more</p>
          </Link>
        ) : null}
      </div>
    </div>
  );
};
