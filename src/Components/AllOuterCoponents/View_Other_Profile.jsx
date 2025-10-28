import React, { useEffect, useRef, useState } from "react";
import blank_profile_img from "../../assets/Images/black_profile.jpg";
import coverimage from "../../assets/Images/cover_image.jpg";
import { FaBriefcase, FaGraduationCap, FaHome } from "react-icons/fa";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";
import { data, Link, useLocation } from "react-router-dom";
import { Loader } from "../Loader/Loader";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";
import axios from "axios";
import { Backend_Path } from "../../Backend_Path";
import toast from "react-hot-toast";
import { TbAccessibleFilled } from "react-icons/tb";
import { useContext } from "react";
import { BranchStoreApi } from "../../BranchStore/BranchStore";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import socket from "../../soket";
import Swal from "sweetalert2";
import { FaArrowUp } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { PiStudentFill } from "react-icons/pi";
import { GrWorkshop } from "react-icons/gr";
import { IoLocationOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { SiLinuxprofessionalinstitute } from "react-icons/si";
export const View_Other_Profile = () => {
  const [User_information, setUser_information] = useState([]);
  const UserId = useLocation();
  const LocalHost_id_Ref = useRef(localStorage.getItem("id"));
  // console.log(UserId);
  const { setre_RenderState } = useContext(BranchStoreApi);
  const [isAllOptionOpen, setisAllOptionOpen] = useState("all");
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const [allready_requested_Data, setallready_requested_Data] = useState([]);
  const [ReroadFriendComponent, setReroadFriendComponent] = useState(1);
  const [send_Request, setsend_Request] = useState();
  const [Check_Alardy_Friend, setCheck_Alardy_Friend] = useState();
  const [allRequstedInformation, setallRequstedInformation] = useState([]);
  const [isUnfriendPopupOpen, setisUnfriendPopupOpen] = useState(false);
  const [postState, setpostState] = useState();
  const [isCommentOpen, setisCommentOpen] = useState([]);
  const [CommentContentState, setCommentContentState] = useState("");
  const [AboutInformation, setAboutInformation] = useState([]);
  // ===================User Information Part Start===========
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    const Fetch_Function = async () => {
      setisLoaderOpen(true);
      try {
        const Local_Storage_id = localStorage.getItem("id");
        const Friend_Requested_Data_Recever = await fetch(
          `${Backend_Path()}/home/friend-recever-data${Local_Storage_id}`
        );
        const Friend_Requested_Recever_Data_Response =
          await Friend_Requested_Data_Recever.json();

        const Array_Only_Id = [];
        Friend_Requested_Recever_Data_Response[0]?.sender_id.map((item) => {
          Array_Only_Id.push(item.id);
        });
        // console.log(Array_Only_Id);
        setsend_Request(Array_Only_Id);

        const Friend_Requested_Data = await fetch(
          `${Backend_Path()}/home/friend-requested-data${Local_Storage_id}`
        );
        const Friend_Requested_Data_Response =
          await Friend_Requested_Data.json();
        setallready_requested_Data(Friend_Requested_Data_Response);

        const [Fetch_User_Information, Fetch_User_Friends, Fetch_User_Posts] =
          await Promise.all([
            fetch(
              `${Backend_Path()}/home/find-user-information${
                UserId.state.user_id
              }`
            ).then((res) => res.json()),
            fetch(
              `${Backend_Path()}/home/find-user-friends${UserId.state.user_id}`
            ).then((res) => res.json()),
            fetch(
              `${Backend_Path()}/home/find-user-posts${UserId.state.user_id}`
            ).then((res) => res.json()),
          ]);
        setpostState(Fetch_User_Posts.posts);
        let AllData = [];
        AllData = [...AllData, Fetch_User_Information];
        AllData = [...AllData, Fetch_User_Friends];
        AllData = [...AllData, Fetch_User_Posts];
        const Check_Alardy_Friend_Fetch = await fetch(
          `${Backend_Path()}/home/find-user-friends${Local_Storage_id}`
        );
        const Check_Alardy_Friend_Fetch_Response =
          await Check_Alardy_Friend_Fetch.json();

        let Check_Alardy_Friend_and_Convert_array = [];
        Check_Alardy_Friend_Fetch_Response.friends.map((item) => {
          Check_Alardy_Friend_and_Convert_array.push(item.id);
        });

        setCheck_Alardy_Friend(Check_Alardy_Friend_and_Convert_array);
        setUser_information(AllData);

        // console.log(User_information);
        setisLoaderOpen(false);
      } catch (error) {
        console.log(error);
        setisLoaderOpen(false);
        toast.error("Server Error");
      }
    };
    Fetch_Function();
    // console.log("ff");
  }, [ReroadFriendComponent, UserId.key]);
  // ===================User Information Part End===========

  // ===================Friend Details Part Start===========
  useEffect(() => {
    const FetchFunction = async () => {
      const FetchData = await fetch(
        `${Backend_Path()}/home/find-user-friends${UserId.state.user_id}`
      );
      const Response = await FetchData.json();
      const Array_Only_Id = [];
      Response.friends.map((item) => {
        Array_Only_Id.push(item.id);
      });

      const Find_RecerverInformation_information_Model = await axios.post(
        `${Backend_Path()}/home/friend-recever-data-information-model`,
        Array_Only_Id
      );
      setallRequstedInformation(
        Find_RecerverInformation_information_Model.data
      );
    };
    FetchFunction();
  }, [UserId.key]);
  // ===================Friend Details Part Start===========

  // ===================Friend Request Part Start===========
  const Friend_Request_Send = async (user_id, type) => {
    const Local_Storage_Id = localStorage.getItem("id");
    try {
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
      setReroadFriendComponent((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };
  useEffect(() => {
    socket.on("user_friend_request_frontend", (data) => {
      console.log(data);
      if (
        data.recever_id == localStorage.getItem("id") ||
        data.sender_id == localStorage.getItem("id")
      )
        setReroadFriendComponent((prev) => prev + 1);
    });
  }, [socket]);
  // ===================Friend Request Part End===========

  // ====================Unfriend Part Start======================
  const UnfriendFunction = () => {
    setisUnfriendPopupOpen(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be Unfriend !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      width: "300px",
    }).then(async (result) => {
      if (result.isConfirmed) {
        socket.emit("user_friend_request", {
          sender_id: localStorage.getItem("id"),
          recever_id: UserId.state.user_id,
          type: "unfriend",
        });
        await axios.post(`${Backend_Path()}/home/unfriend`, {
          user1: UserId.state.user_id,
          user2: localStorage.getItem("id"),
        });
        Swal.fire({
          title: "Unfriend",
          text: "Unfriend Successfully!",
          icon: "success",
          width: "300px",
        });
      }
    });
  };
  const Like_and_Comment_Function = async (item, type) => {
    try {
      if (type == "like") {
        socket.emit("like_listen", {
          type: "like",
          array_emenent_id: item?._id,
          recever_id: UserId.state.user_id,
          sender_id: localStorage.getItem("id"),
          name: User_information[0]?.name,
          profilePic: User_information[0]?.profilePic,
        });
      } else if (type == "dislike") {
        socket.emit("like_listen", {
          type: "dislike",
          recever_id: UserId.state.user_id,
          sender_id: localStorage.getItem("id"),
          array_emenent_id: item?._id,
        });
      } else {
        if (CommentContentState == "") {
          toast.error("Write Comment...");
        } else {
          socket.emit("like_listen", {
            type: "comment",
            array_emenent_id: item?._id,
            recever_id: UserId.state.user_id,
            sender_id: localStorage.getItem("id"),
            name: User_information[0]?.name,
            content: CommentContentState,
            profilePic: UserId?.state?.profilePic,
          });
          setCommentContentState("");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    socket.on("like_update", (Data) => {
      if (Data.type == "like") {
        console.log(Data);

        setpostState((prev) =>
          prev.map((item) => {
            if (item._id == Data.array_emenent_id) {
              item?.likes.push({
                name: Data.name,
                profilePic: Data.profilePic,
                user_id: Data.sender_id,
              });
              return item;
            } else {
              return item;
            }
          })
        );
      } else if (Data.type == "dislike") {
        console.log(Data);
        setpostState((prev) =>
          prev.map((item) => {
            if (item._id == Data.array_emenent_id) {
              return {
                ...item,
                likes: item.likes.filter((value) => {
                  console.log(value);

                  return value.user_id != Data.sender_id;
                }),
              };
            } else {
              return item;
            }
          })
        );
      } else if (Data.type == "comment") {
        // console.log(Data);
        setpostState((prev) =>
          prev.map((item) => {
            if (item._id == Data.array_emenent_id) {
              item?.comments.push({
                name: Data.name,
                profilePic: Data.profilePic,
                content: Data.content,
                time: "now",
                user_id: Data.sender_id,
              });
              return item;
            } else {
              return item;
            }
          })
        );
      }
    });
    // console.log(data);
  }, [socket]);
  const [isScrollTop, setisScrollTop] = useState(false);
  const ScrollTop = () => {
    console.log(window.innerHeight);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const ScrollFunction = () => {
      if (window.scrollY + window.innerHeight - 500 > window.innerHeight) {
        setisScrollTop(true);
      } else {
        setisScrollTop(false);
      }
      // console.log(window.scrollY + window.innerHeight > window.innerHeight);
    };
    window.addEventListener("scroll", ScrollFunction);
    return () => window.removeEventListener("scroll", ScrollFunction);
  });
  return (
    <>
      <Loader isLoaderOpen={isLoaderOpen} />
      <div className=" w-full h-fit pt-[13vh] md:pt-[8vh] md:px-[17em]">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div
              className={`fixed animate-bounce transition-all duration-300 ease-in-out bottom-10 right-3 md:bottom-6 cursor-pointer shadow-md md:right-72 z-[1000] bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center  
                ${
                  isScrollTop
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              onClick={() => {
                return ScrollTop();
              }}
            >
              <FaArrowUp />
            </div>
            <div className="bg-[#f0f2f5] h-fit md:pb-8 pt-2">
              <div className="bg-white shadow mb-4 ">
                <div className={`relative mb-2`}>
                  <div className="md:h-[30vh] h-[25vh] overflow-hidden">
                    <img
                      src={
                        User_information[0]?.coverPhoto == ""
                          ? coverimage
                          : User_information[0]?.coverPhoto
                      }
                      alt="Cover"
                      className="w-full object-cover h-[100%] rounded-tl-md rounded-tr-md"
                    />
                  </div>
                  <div className="absolute bottom-0 md:top-[35%] top-[35%] left-8 transform">
                    <img
                      src={
                        User_information[0]?.profilePic == ""
                          ? blank_profile_img
                          : User_information[0]?.profilePic
                      }
                      alt="Profile"
                      className="w-40 h-40 rounded-full border-4 border-white"
                    />
                  </div>
                  <div className="h-fit pt-20 md:pt-16 flex items-center justify-between px-5">
                    <div>
                      <h1 className="text-3xl font-bold">
                        {User_information[0]?.name}
                      </h1>
                      <p className="text-gray-600">
                        {User_information[0]?.bio}
                      </p>
                    </div>
                    {Check_Alardy_Friend?.includes(UserId?.state?.user_id) ? (
                      <Link
                        to={"/messenger"}
                        state={{ user: User_information[0] }}
                        className="bg-gray-200 px-2 py-2 h-fit rounded-md font-semibold hover:bg-gray-300"
                      >
                        Message
                      </Link>
                    ) : null}
                  </div>
                  {User_information[0]?.user_id ==
                  LocalHost_id_Ref.current ? null : (
                    <div className="absolute top-[40%] right-0 md:right-0 md:top-36 transform translate-y-full p-4 flex gap-4 w-fit">
                      {Check_Alardy_Friend?.includes(
                        User_information[0]?.user_id
                      ) ? (
                        <div className="flex gap-2">
                          <button className="bg-gray-200 px-3 py-2 h-fit rounded-md font-semibold cursor-default flex items-center justify-center gap-1">
                            <FaUserFriends />
                            Friend
                          </button>
                          <div className={`relative`}>
                            <button
                              className="bg-gray-200 p-2 rounded-md h-full"
                              onClick={() =>
                                setisUnfriendPopupOpen((prev) =>
                                  prev ? false : true
                                )
                              }
                            >
                              <FaEllipsisH />
                            </button>
                            <div
                              className={`absolute -top-8 -left-12 border border-black text-red-600 bg-slate-200 flex items-center justify-center h-fit w-fit px-2 rounded-md cursor-pointer ${
                                isUnfriendPopupOpen ? "flex" : "hidden"
                              }`}
                              onClick={() => UnfriendFunction()}
                            >
                              Unfriend
                            </div>
                          </div>
                        </div>
                      ) : send_Request?.includes(
                          User_information[0]?.user_id
                        ) && User_information[0]?.user_id ? (
                        <button
                          type="button"
                          class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l font-medium rounded-lg text-sm flex items-center justify-center px-2 py-2 gap-1 text-center"
                          onClick={() =>
                            Friend_Request_Send(
                              User_information[0]?.user_id,
                              "accept"
                            )
                          }
                        >
                          <TbAccessibleFilled />
                          Accept
                        </button>
                      ) : allready_requested_Data[0]?.recever_id?.some(
                          (item) => item.id === User_information[0]?.user_id
                        ) ? (
                        <button
                          type="button"
                          class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br  shadow-lg shadow-red-500/50 dark:shadow-lg font-medium rounded-lg text-sm px-3 py-2 gap-1 text-center flex items-center"
                          onClick={() =>
                            Friend_Request_Send(
                              User_information[0]?.user_id,
                              "cancle"
                            )
                          }
                        >
                          <IoPersonRemoveSharp />
                          Cancle
                        </button>
                      ) : (
                        <div>
                          <button
                            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm flex items-center justify-center px-2 py-2 gap-1 text-center"
                            onClick={() =>
                              Friend_Request_Send(
                                User_information[0]?.user_id,
                                "add"
                              )
                            }
                          >
                            <IoPersonAdd />
                            Add Friend
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-300 px-8">
                  <div className="flex gap-8 p-3">
                    <p
                      className={`${
                        isAllOptionOpen == "all"
                          ? "border-b-4 rounded-xl border-blue-500 px-4 font-semibold cursor-pointer"
                          : "text-gray-400 cursor-pointer"
                      }`}
                      onClick={() => setisAllOptionOpen("all")}
                    >
                      All
                    </p>
                    <p
                      className={`${
                        isAllOptionOpen == "posts"
                          ? "border-b-4 rounded-xl border-blue-500 px-4 font-semibold cursor-pointer"
                          : "text-gray-400 cursor-pointer"
                      }`}
                      onClick={() => setisAllOptionOpen("posts")}
                    >
                      Posts
                    </p>
                    <p
                      className={`${
                        isAllOptionOpen == "friends"
                          ? "border-b-4 rounded-xl border-blue-500 px-4 font-semibold cursor-pointer"
                          : "text-gray-400 cursor-pointer"
                      }`}
                      onClick={() => setisAllOptionOpen("friends")}
                    >
                      Friends
                    </p>
                    <p
                      className={`${
                        isAllOptionOpen == "photos"
                          ? "border-b-4 rounded-xl border-blue-500 px-4 font-semibold cursor-pointer"
                          : "text-gray-400 cursor-pointer"
                      }`}
                      onClick={() => setisAllOptionOpen("photos")}
                    >
                      DOB
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={`space-y-4
                 ${
                   isAllOptionOpen == "all" || isAllOptionOpen == "friends"
                     ? "block"
                     : "hidden"
                 }
            `}
                >
                  <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="font-bold text-xl mb-4">Intro</h2>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1 items-center text-gray-500">
                        <PiStudentFill className="text-xl" />
                        {User_information[0]?.about?.length > 0
                          ? User_information[0]?.about[0]?.education ==
                            "No Education to Show"
                            ? "No Education to Show"
                            : `Studied ${User_information[0]?.about[0]?.education}`
                          : null}
                      </div>
                      <div className="flex gap-2 items-center text-gray-500">
                        <GrWorkshop className="text-lg" />
                        {User_information[0]?.about?.length > 0
                          ? User_information[0]?.about[0]?.work ==
                            "No Workplace to Show"
                            ? "No Workplace to Show"
                            : `Works at ${User_information[0]?.about[0]?.work}`
                          : null}
                      </div>
                      <div className="flex gap-1 items-center text-gray-500">
                        <IoLocationOutline className="text-xl" />
                        {User_information[0]?.about?.length > 0
                          ? User_information[0]?.about[0]?.location ==
                            "No location to Show"
                            ? "No location to Show"
                            : `Lives in ${User_information[0]?.about[0]?.location}`
                          : null}
                      </div>
                      <div className="flex gap-1 items-center text-gray-500">
                        <MdDriveFileRenameOutline className="text-xl" />
                        {User_information[0]?.about?.length > 0
                          ? User_information[0]?.about[0]?.nickname ==
                            "No Nick Name added"
                            ? "No Nick Name added"
                            : `Nick Name- ${User_information[0]?.about[0]?.nickname}`
                          : null}
                      </div>
                      <div className="flex gap-1 items-center text-gray-500">
                        <SiLinuxprofessionalinstitute className="text-xl" />
                        {User_information[0]?.about?.length > 0
                          ? User_information[0]?.about[0]?.profession ==
                            "No Profession to Show"
                            ? "No Profession to Show"
                            : `Profession is ${User_information[0]?.about[0]?.profession}`
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-xl">Friends</h2>
                      <Link
                        to={"/see-all-friends"}
                        state={{ All_Friends: allRequstedInformation }}
                        className={`text-[#1877f2] ${
                          allRequstedInformation?.length > 0 ? "flex" : "hidden"
                        }`}
                      >
                        See All Friends
                      </Link>
                    </div>
                    <div
                      className={`w-full overflow-scroll Scroll ${
                        allRequstedInformation?.length > 0
                          ? "md:h-[10em]"
                          : "md:h-fit"
                      } flex justify-start overflow-hidden`}
                    >
                      {/* ===========Multiple Friends Start============== */}
                      {allRequstedInformation?.length > 0 ? (
                        allRequstedInformation?.map((friend) => (
                          <Link
                            key={friend._id}
                            className="relative group cursor-pointer shrink-0 h-[10em] md:w-[15%] flex flex-col items-center justify-start"
                            to={"/view-other-profile"}
                            state={{
                              user_id: friend?.user_id,
                            }}
                          >
                            <img
                              src={
                                friend?.profilePic == ""
                                  ? blank_profile_img
                                  : friend?.profilePic
                              }
                              alt={"Loading...."}
                              className={`rounded-2xl  h-[7em] p-2 pt-0.5`}
                            />
                            <p className="text-md font-semibold text-center h-fit">
                              {friend?.name}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <div className="h-full top-0 w-full flex items-center justify-center">
                          <p className="text-center text-gray-400">
                            You don't have any friends
                          </p>
                        </div>
                      )}
                      {/* ===========Multiple Friends End============== */}
                      {/* <div className="relative group cursor-pointer shrink-0 h-[10em] w-[15%] flex flex-col items-center justify-center gap-2">
                    <img
                      src={blank_profile_img}
                      alt={"Loading...."}
                      className="rounded-lg aspect-square object-cover h-[90%]"
                    />
                    <p className="text-md font-semibold">Pritam Mandal</p>
                  </div> */}
                    </div>
                  </div>
                </div>
                <div className="mt-4"></div>
                <div
                  className={`mt-4 ${
                    isAllOptionOpen == "all" || isAllOptionOpen == "posts"
                      ? "block"
                      : "hidden"
                  }`}
                >
                  {/* CreatePost Start */}
                  <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <div className="flex gap-3">
                      <img
                        src={
                          User_information[0]?.profilePic == ""
                            ? blank_profile_img
                            : User_information[0]?.profilePic
                        }
                        alt="Loading.."
                        className="w-10 h-10 rounded-full"
                      />
                      <input
                        type="text"
                        placeholder="What's on your mind?"
                        className="bg-gray-100 rounded-full px-4 py-2 w-full hover:bg-gray-200 cursor-pointer"
                        readOnly
                      />
                    </div>
                  </div>
                  {/* CreatePost End */}
                  {postState?.length > 0 ? (
                    postState?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={`bg-white rounded-lg shadow p-4 mb-4 w-full`}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <img
                              src={
                                User_information[0]?.profilePic == ""
                                  ? blank_profile_img
                                  : User_information[0]?.profilePic
                              }
                              alt={"..."}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {User_information[0]?.name}
                              </h3>
                              <p className="text-gray-500 text-sm">
                                Posted-{item?.time?.split("T")[0]}
                              </p>
                            </div>
                          </div>
                          <p
                            className={`m-4 ${
                              item?.image?.length > 0 ? "block" : "hidden"
                            }`}
                          >
                            {item?.content}
                          </p>
                          {item?.catagory == "text" ? (
                            <div className="h-fit w-full flex justify-between mb-4 flex-wrap">
                              <div
                                className={`min-h-[15em] p-6 rounded-lg flex items-center justify-center w-full`}
                                style={{
                                  backgroundColor: `${
                                    item?.bg_color == "white"
                                      ? "#80808010"
                                      : item?.bg_color
                                  }`,
                                  color: ` ${
                                    item?.bg_color == "white"
                                      ? "black"
                                      : "white"
                                  }`,
                                }}
                              >
                                <p className={`m-4 text-[20px]`}>
                                  {item?.content}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="h-fit w-full flex justify-center gap-4 mb-4 flex-wrap">
                              {/* =========This is For Multiple Image Start======== */}
                              {item.image.map((item, index) => {
                                return (
                                  <img
                                    key={index}
                                    src={item}
                                    alt="posts"
                                    className="rounded-lg shrink-0 md:w-[49%] w-full h-full border-2"
                                  />
                                );
                              })}
                              {/* =========This is For Multiple Image End======== */}
                            </div>
                          )}
                          <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200">
                            <button
                              className={`flex flex-col items-center gap-0`}
                              onClick={() => {
                                if (
                                  item?.likes?.some(
                                    (like) =>
                                      localStorage.getItem("id") == like.user_id
                                  )
                                ) {
                                  Like_and_Comment_Function(item, "dislike");
                                } else {
                                  Like_and_Comment_Function(item, "like");
                                }
                              }}
                            >
                              <p
                                className={`flex items-center gap-2 ${
                                  item?.likes?.some(
                                    (like) =>
                                      localStorage.getItem("id") == like.user_id
                                  )
                                    ? "text-blue-600"
                                    : "text-gray-600"
                                }`}
                              >
                                <FaThumbsUp /> {item?.likes?.length}
                              </p>
                            </button>
                            <button
                              className="flex items-center gap-2 text-gray-600"
                              onClick={() => {
                                setisCommentOpen((prev) => {
                                  let flag = false;
                                  const Updated = prev?.map((open) => {
                                    if (open.user_id == item?._id) {
                                      flag = true;
                                      return { ...open, action: !open.action };
                                    }
                                    return open;
                                  });
                                  if (!flag) {
                                    Updated.push({
                                      user_id: item?._id,
                                      action: true,
                                    });
                                  }
                                  return Updated;
                                });
                              }}
                            >
                              <p
                                className={`flex items-center gap-2 ${
                                  item?.comments?.some(
                                    (comment) =>
                                      localStorage.getItem("id") ==
                                      comment.user_id
                                  )
                                    ? "text-blue-600"
                                    : "text-gray-600"
                                }`}
                              >
                                <FaComment /> {item?.comments?.length}
                              </p>
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 ">
                              <FaShare /> Share
                            </button>
                          </div>
                          <div
                            className={`w-full p-2 items-center transition-all duration-300 ease-in-out justify-center ${
                              isCommentOpen.some(
                                (open) =>
                                  open.user_id == item?._id && open.action
                              )
                                ? "opacity-100 h-fit pointer-events-auto"
                                : "opacity-0 h-0 pointer-events-none"
                            }`}
                          >
                            <div className="w-full flex flex-col gap-2">
                              {item?.comments?.length == 0 ? (
                                <p className="text-gray-400 text-[13px] text-center">
                                  No Comments Found.
                                </p>
                              ) : (
                                item?.comments?.map((comment) => {
                                  return (
                                    <div
                                      class="flex relative my-4"
                                      key={comment?._id}
                                    >
                                      <div class="relative flex flex-col gap-2 px-2 border rounded-lg bg-white">
                                        <div class="relative flex gap-1">
                                          <img
                                            src={
                                              comment?.profilePic == ""
                                                ? blank_profile_img
                                                : comment?.profilePic
                                            }
                                            alt={"..."}
                                            class="relative rounded-lg -top-5 -mb-4  bg-white border h-10 w-10"
                                            loading="lazy"
                                          />
                                          <div class="flex flex-col -space-y-1 w-full">
                                            <div class="flex flex-row justify-between">
                                              <h3 class="font-semibold">
                                                {comment?.name}
                                              </h3>
                                            </div>
                                            <p class="text-gray-400 text-[11px]">
                                              {comment?.time?.split("T")[0]}
                                            </p>
                                          </div>
                                        </div>
                                        <p class="px-11 -mt-2 text-gray-600">
                                          {comment?.content}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                              <div class="w-full bg-white rounded-lg border p-2mt-20 ">
                                <div class="px-3 mb-2 mt-2">
                                  <textarea
                                    placeholder={`Comment as ${User_information[0]?.name}`}
                                    class="w-full bg-gray-100 rounded border border-gray-400 leading-normal h-12 py-1 px-3 font-normal text-[15px] placeholder-gray-400 focus:outline-none focus:bg-white"
                                    value={CommentContentState}
                                    onChange={(e) =>
                                      setCommentContentState(e.target.value)
                                    }
                                  ></textarea>
                                </div>
                                <div class="flex justify-end px-4 mb-2">
                                  <button
                                    class="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500"
                                    onClick={() =>
                                      Like_and_Comment_Function(item, "comment")
                                    }
                                  >
                                    Comment
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <h1 className="text-center text-gray-400 m-2 mb-4">
                      No post available
                    </h1>
                  )}
                </div>
                {/* ================Date Of Birth Part Start============ */}
                <div className={`bg-white rounded-lg shadow p-4`}>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        User_information[0]?.profilePic == ""
                          ? blank_profile_img
                          : User_information[0]?.profilePic
                      }
                      alt={"Loading"}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">Pritam Mandal</h3>
                      <p className="text-gray-500 text-sm">2 hours ago</p>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center flex-col">
                    <div className="text-4xl p-2 bg-blue-600 rounded-full text-white shadow-2xl">
                      <LiaBirthdayCakeSolid />
                    </div>
                    <p className={`font-semibold text-lg`}>
                      Born on{" "}
                      {User_information[0]?.dob.split("/")[1] +
                        " " +
                        User_information[0]?.dob.split("/")[0] +
                        " " +
                        User_information[0]?.dob.split("/")[2]}{" "}
                    </p>
                  </div>
                </div>
                {/* ================Date Of Birth Part End============ */}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
