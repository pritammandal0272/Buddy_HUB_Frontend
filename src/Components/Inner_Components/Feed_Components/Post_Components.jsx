import React, { useRef, useState } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import { useEffect } from "react";
import { Backend_Path } from "../../../Backend_Path";
import { Link } from "react-router-dom";
import axios from "axios";
import socket from "../../../soket";
import { useContext } from "react";
import "../../../assets/Styles/style.css";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import toast from "react-hot-toast";
import { FriendSuggestions } from "./FriendSuggestions";
export const Post_Components = ({ Add_Frist_OwnPost }) => {
  const [CommentContentState, setCommentContentState] = useState("");
  const [isCommentOpen, setisCommentOpen] = useState([]);
  const { User_information } = useContext(BranchStoreApi);
  const [likeUpdate, setLikeUpdate] = useState([]);
  const [AllPost, setAllPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const handleScroll = async () => {
      if (
        Math.ceil(document.documentElement.scrollTop + window.innerHeight) >=
          document.documentElement.scrollHeight - 50 &&
        !isLoading
      ) {
        setIsLoading(true);
        try {
          const FetchData = await fetch(
            `${Backend_Path()}/home/feed/all-posts`
          );
          const FetchResponse = await FetchData.json();
          const NewArray = [...AllPost, ...FetchResponse];

          if (AllPost?.length % 2 != 0) {
            const FetchDataSuggestions = await fetch(
              `${Backend_Path()}/home/suggestions-friends${localStorage.getItem(
                "id"
              )}`
            );
            const FetchResponseSuggestions = await FetchDataSuggestions.json();
            // console.log(FetchDataSuggestions);

            setAllPost([...NewArray, FetchResponseSuggestions]);
          } else {
            setAllPost(NewArray);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, AllPost]);

  useEffect(() => {
    console.log(Add_Frist_OwnPost);

    const FetchFunction = async () => {
      try {
        const FetchData = await fetch(`${Backend_Path()}/home/feed/all-posts`);
        const FetchResponse = await FetchData.json();
        // console.log(Object.keys(Add_Frist_OwnPost));

        if (Object.keys(Add_Frist_OwnPost).length > 0) {
          const Array = [Add_Frist_OwnPost];
          const NewArray = [...Array, ...FetchResponse];
          // console.log(NewArray);
          setAllPost(NewArray);
        } else {
          setAllPost(FetchResponse);
        }
      } catch (err) {
        console.log(err);
      }
    };
    FetchFunction();
  }, [Add_Frist_OwnPost]);
  const Like_and_Comment_Function = async (item, type) => {
    // console.log(item);

    try {
      if (type == "like") {
        socket.emit("like_listen", {
          type: "like",
          array_emenent_id: item?.array_emenent_id,
          recever_id: item?.user_id,
          sender_id: localStorage.getItem("id"),
          name: item?.name,
          profilePic: item?.profilePic,
        });
      } else if (type == "dislike") {
        socket.emit("like_listen", {
          type: "dislike",
          recever_id: item?.user_id,
          sender_id: localStorage.getItem("id"),
          array_emenent_id: item?.array_emenent_id,
        });
      } else {
        if (CommentContentState == "") {
          toast.error("Write Comment...");
        } else {
          socket.emit("like_listen", {
            type: "comment",
            array_emenent_id: item?.array_emenent_id,
            recever_id: item?.user_id,
            sender_id: localStorage.getItem("id"),
            name: item?.name,
            content: CommentContentState,
            profilePic: item?.profilePic,
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
        setAllPost((prev) =>
          prev.map((item) => {
            if (item.array_emenent_id == Data.array_emenent_id) {
              item?.likes.push({
                name: Data.name,
                profilePic: "",
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
        setAllPost((prev) =>
          prev.map((item) => {
            if (item.array_emenent_id == Data.array_emenent_id) {
              return {
                ...item,
                likes: item.likes.filter((value) => {
                  // console.log(value);

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
        setAllPost((prev) =>
          prev.map((item) => {
            if (item.array_emenent_id == Data.array_emenent_id) {
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
  }, [socket]);
  // useEffect(() => {
  //   console.log(AllPost);
  // }, [AllPost]);
  return (
    <>
      <div className="bg-gray-100 w-full flex items-center flex-col justify-center mt-4">
        {AllPost?.map((item, index) => {
          return item?.type == "post" ? (
            <div
              key={index}
              className={`bg-white rounded-lg shadow p-4 mb-4 w-full`}
            >
              <Link
                className="flex items-center gap-3 mb-4"
                to={"/view-other-profile"}
                state={{
                  user_id: item?.user_id,
                }}
              >
                <img
                  src={
                    item?.profilePic == ""
                      ? blank_profile_img
                      : item?.profilePic
                  }
                  alt={"..."}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{item?.name}</h3>
                  <p className="text-gray-500 text-sm">
                    Posted-{item?.time?.split("T")[0]}
                  </p>
                </div>
              </Link>
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
                        item?.bg_color == "white" ? "#80808010" : item?.bg_color
                      }`,
                      color: ` ${
                        item?.bg_color == "white" ? "black" : "white"
                      }`,
                    }}
                  >
                    <p className={`m-4 text-[20px]`}>{item?.content}</p>
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
                        className="rounded-lg shrink-0 w-full shadow-md md:w-[49%] h-full"
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
                        (like) => localStorage.getItem("id") == like.user_id
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
                        (like) => localStorage.getItem("id") == like.user_id
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
                        if (open.user_id == item?.array_emenent_id) {
                          flag = true;
                          return { ...open, action: !open.action };
                        }
                        return open;
                      });
                      if (!flag) {
                        Updated.push({
                          user_id: item?.array_emenent_id,
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
                        (like) => localStorage.getItem("id") == like.user_id
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
                      open.user_id == item?.array_emenent_id && open.action
                  )
                    ? "opacity-100 h-fit pointer-events-auto"
                    : "opacity-0 h-0  pointer-events-none"
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
                        <div class="flex relative my-4" key={comment._id}>
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
                                  <h3 class="font-semibold">{comment?.name}</h3>
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
                        onChange={(e) => setCommentContentState(e.target.value)}
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
          ) : (
            <FriendSuggestions item={item} />
          );
        })}

        <div
          className="relative w-full h-[130px] mb-[10px] rounded-md p-[15px]
                  bg-[#fff] overflow-hidden shadow-md"
        >
          <div className="relative w-full h-full">
            {/* Circle */}
            <div className="bg-[#cacaca] animate-pulse w-[50px] h-[50px] rounded-full"></div>

            {/* Lines */}
            <div className="absolute animate-pulse bg-[#cacaca] top-[11px] left-[58px] h-[10px] w-[100px]"></div>
            <div className="absolute animate-pulse bg-[#cacaca] top-[34px] left-[58px] h-[10px] w-[150px]"></div>
            <div className="absolute animate-pulse bg-[#cacaca] top-[57px] left-0 h-[10px] w-full"></div>
            <div className="absolute animate-pulse bg-[#cacaca] top-[80px] left-0 h-[10px] w-[92%]"></div>
          </div>
        </div>
      </div>
    </>
  );
};
