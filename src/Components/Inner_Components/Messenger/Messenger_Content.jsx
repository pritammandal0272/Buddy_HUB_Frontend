import React, { useContext, useEffect, useRef, useState } from "react";
import { Messenger_Store_Context } from "../../../Messenger_Store/Messenger_Store";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { IoCheckmarkOutline } from "react-icons/io5";
import "../../../assets/Styles/style.css";
import { IoChevronBack } from "react-icons/io5";
import socket from "../../../soket";
export const Messenger_Content = ({ RouteData }) => {
  const {
    Messenger_User_Content,
    setResponsiveState,
    setMessenger_User_Content,
    ResponsiveState,
    Send_Message,
    Chatall_Data,
    SeleteUser,
    userStatus,
  } = useContext(Messenger_Store_Context);

  const ScrollRef = useRef(null);
  const [inputBoxDataState, setinputBoxDataState] = useState({
    value: "",
  });
  useEffect(() => {
    if (RouteData?.state != null) {
      setMessenger_User_Content(RouteData?.state?.user);
      SeleteUser(RouteData?.state?.user);
    }
  }, [RouteData]);
  const inputBoxFunction = (e) => {
    setinputBoxDataState((prev) => ({ ...prev, value: e.target.value }));
  };
  useEffect(() => {
    ScrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [Chatall_Data]);
  return (
    <>
      <div
        class={`flex-1 flex flex-col rounded-lg h-full transition-all duration-300 ease-in-out relative overflow-hidden ${
          ResponsiveState
            ? " opacity-100 pointer-events-auto md:pointer-events-auto md:opacity-100"
            : " opacity-0 pointer-events-none md:pointer-events-auto md:opacity-100"
        }`}
      >
        {Messenger_User_Content == "home" ? (
          <div
            class={`h-full bg-[#75caff50] rounded-lg shadow-xl flex flex-col items-center justify-center`}
          >
            <h1
              className="text-[50px] font-semibold font-[Colonna MT] text-purple-500"
              style={{ fontFamily: "Lucida Calligraphy" }}
            >
              Welcome There!!
            </h1>
            <p
              className="text-md text-gray-500"
              style={{ fontFamily: "Comic Sans MS" }}
            >
              Now select your friend and Start your Conversation.
            </p>
          </div>
        ) : (
          <div className=" relative">
            {/* <!-- Chat Header --> */}
            <div class="p-4 py-2 bg-card border-b border-border w-full bg-white">
              <div class="flex items-center space-x-2">
                <IoChevronBack
                  className="text-2xl cursor-pointer"
                  onClick={() => {
                    socket.emit("leave_room", localStorage.getItem("id"));
                    setResponsiveState(false);
                    setMessenger_User_Content("home");
                  }}
                />
                <img
                  src={
                    Messenger_User_Content?.profilePic == ""
                      ? blank_profile_img
                      : Messenger_User_Content?.profilePic
                  }
                  alt="Chat Contact"
                  class="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 class="text-foreground font-semibold">
                    {Messenger_User_Content?.name}
                  </h2>
                  <p
                    className={`text-sm text-muted-foreground ${
                      userStatus?.includes(Messenger_User_Content.user_id)
                        ? "text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {userStatus?.includes(Messenger_User_Content.user_id)
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-[75vh] rounded-lg pb-16 Scroll bg-[#75caff50] overflow-y-auto">
              {/* <!-- Messages --> */}
              {/* {console.log(Chatall_Data)} */}

              <div class="p-2 px-4">
                {Chatall_Data?.map((items, index) => {
                  return items?.sender_id == localStorage.getItem("id") ? (
                    <div
                      key={index}
                      class="flex items-end justify-end gap-2 mb-2"
                    >
                      <div class="max-w-md relative rounded-lg px-2 py-2 pr-14 bg-[#00826a] rounded-br-none text-white">
                        <p class="text-primary-foreground mr-6">
                          {items?.chat}
                        </p>
                        <div className="flex justify-center absolute bottom-1 right-1 gap-1 items-center float-right">
                          <p className="text-[11px] text-gray-200">
                            {items?.time}
                          </p>
                          <p>
                            {(userStatus?.includes(
                              Messenger_User_Content?.user_id
                            ) &&
                              items?.seen) ||
                            items?.seen ? (
                              <LiaCheckDoubleSolid className="text-[#00bbff]" />
                            ) : userStatus?.includes(
                                Messenger_User_Content?.user_id
                              ) || items?.deleverd ? (
                              <LiaCheckDoubleSolid />
                            ) : (
                              <IoCheckmarkOutline />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={index} class="flex items-start gap-2 mb-2">
                      <img
                        src={
                          Messenger_User_Content?.profilePic == ""
                            ? blank_profile_img
                            : Messenger_User_Content?.profilePic
                        }
                        alt="Loading..."
                        class="w-8 h-8 rounded-full"
                      />
                      <div class="max-w-md bg-white shadow-2xl w-fit relative px-2 py-2 pr-12 rounded-lg">
                        <p class="text-foreground mr-4">{items?.chat}</p>
                        <p className="absolute bottom-0.5 text-[11px] text-gray-500 right-2">
                          {items?.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div ref={ScrollRef}></div>
            </div>
            {/* <!-- Message Input --> */}
            <div class="p-4 py-3 border-t border-border rounded-lg bg-white shadow-md absolute bottom-6 md:bottom-0 w-full">
              <div class="flex items-center space-x-2">
                <button class="hover:bg-muted rounded-full">
                  <svg
                    class="w-6 h-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputBoxDataState.value}
                  onChange={(e) => inputBoxFunction(e)}
                  class="flex-1 bg-muted border-none rounded-full bg-slate-200 px-4 py-2 focus:ring-2 focus:ring-primary"
                />
                <button class="p-2 md:flex hidden hover:bg-muted rounded-full">
                  <svg
                    class="w-6 h-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </button>
                <button class="p-2 md:flex hidden hover:bg-muted rounded-full">
                  <svg
                    class="w-6 h-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </button>
                <button
                  class="rounded-full bg-blue-500 text-white shadow-2xl p-2 hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    Send_Message(inputBoxDataState.value);
                    setinputBoxDataState({ value: "" });
                  }}
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
