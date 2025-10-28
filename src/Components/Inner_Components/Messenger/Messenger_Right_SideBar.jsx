import React, { use, useContext, useEffect, useState } from "react";
import { Backend_Path } from "../../../Backend_Path";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import axios, { all } from "axios";
import { Messenger_Store_Context } from "../../../Messenger_Store/Messenger_Store";
import socket from "../../../soket";
import { useRef } from "react";
import { Loader } from "../../Loader/Loader";
export const Messenger_Right_Side_Bar = () => {
  const [allRequstedInformation, setallRequstedInformation] = useState([]);
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const SearchBoxState = useRef();
  const LocalHostId = localStorage.getItem("id");
  const {
    SeleteUser,
    userStatus,
    Messenger_User_Content,
    ResponsiveState,
    SeenSms_Re_render_Sidebar_notification,
  } = useContext(Messenger_Store_Context);
  const [CountNotification, setCountNotification] = useState({});
  const CountNotificationRef = useRef({});
  useEffect(() => {
    const FetchFunction = async () => {
      try {
        setisLoaderOpen(true);
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
        setisLoaderOpen(false);
      } catch (err) {
        console.log(err);
      }
    };
    FetchFunction();
  }, []);
  // =====================Search Box Start==================

  const SearchBoxFunction = async (e) => {
    const newValue = e.target.value;
    SearchBoxState.current = newValue;
    try {
      setisLoaderOpen(true);
      setTimeout(async () => {
        const Allrady_FriendData = await axios.get(
          `${Backend_Path()}/home/find-user-friends${localStorage.getItem(
            "id"
          )}`
        );
        let Object_to_array_Converter = [];
        Allrady_FriendData.data.friends.map((item) =>
          Object_to_array_Converter.push(item.id)
        );
        const SearchData = await axios.post(
          `${Backend_Path()}/home/connection-part-searchbox`,
          { name: SearchBoxState.current }
        );
        const Filter_Who_are_Already_Friend = SearchData.data.filter((item) => {
          return Object_to_array_Converter.includes(item.user_id);
        });
        setallRequstedInformation(Filter_Who_are_Already_Friend);
        setisLoaderOpen(false);
      }, [500]);
    } catch (err) {
      console.log(err);
    }
  };
  // =====================Search Box End==================
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
        return { [String(Count[0]?.sender_id)]: Count.length };
      }
    };

    const runFetch = async () => {
      let freshObj = {};
      for (let i = 0; i < allRequstedInformation.length; i++) {
        const res = await FetchFunction(i);
        freshObj = { ...freshObj, ...res };
      }
      setCountNotification(freshObj);
    };

    runFetch();
  }, [
    allRequstedInformation,
    SeenSms_Re_render_Sidebar_notification,
    location.pathname,
  ]);

  // useEffect(() => {
  //   console.log(CountNotification);
  // }, [CountNotification]);
  return (
    <>
      <div
        className={`bg-white border-r border-border md:flex flex-col shadow-xl md:mr-2 rounded-lg ${
          ResponsiveState ? "hidden md:flex" : "w-full md:w-72"
        }`}
      >
        <Loader isLoaderOpen={isLoaderOpen} />
        {/* <!-- Search Bar --> */}
        <div className="p-4 border-b border-border h-fit">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              onChange={(e) => SearchBoxFunction(e)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary bg-slate-300"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-3 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
        {/* <!-- Contacts List --> */}
        <div className="">
          <div className="p-2 hover:bg-secondary cursor-pointer">
            {allRequstedInformation?.length > 0 ? (
              allRequstedInformation?.map((user, index) => {
                return (
                  <div
                    className={`flex items-center gap-2 px-2 py-1 transition-all ease-in-out duration-300 mb-2 ${
                      Messenger_User_Content?.user_id == user.user_id
                        ? "bg-slate-200 rounded-md"
                        : null
                    }`}
                    onClick={() => SeleteUser(user)}
                    key={index}
                  >
                    <div className="relative">
                      <img
                        src={
                          user?.profilePic == ""
                            ? blank_profile_img
                            : user?.profilePic
                        }
                        alt="Contact 1"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {userStatus?.includes(user.user_id) ? (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold">
                        {user?.name}
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

                    {String(user?.user_id) in CountNotification ? (
                      <button
                        type="button"
                        class="inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white bg-red-500 rounded-full "
                      >
                        SMS
                        <span class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-red-800 bg-blue-300 rounded-full">
                          {CountNotification[`${user?.user_id}`]}
                        </span>
                      </button>
                    ) : null}
                  </div>
                );
              })
            ) : !isLoaderOpen ? (
              <p className="text-center mt-2 text-gray-400">
                Friends Record Not Found
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
