import React, { useContext } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import { useEffect } from "react";
import { Backend_Path } from "../../../Backend_Path";
import socket from "../../../soket";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axios from "axios";
export const Post = () => {
  const [CommentContentState, setCommentContentState] = useState("");
  const [isCommentOpen, setisCommentOpen] = useState([]);
  const [isPoseDeleteOpen, setisPoseDeleteOpen] = useState([]);
  const { User_information } = useContext(BranchStoreApi);
  const [postState, setpostState] = useState();
  useEffect(() => {
    const Local_Host_Id = localStorage.getItem("id");
    const FetchFunction = async () => {
      const Fetch_Post_Data = await fetch(
        `${Backend_Path()}/home/find-user-posts${Local_Host_Id}`
      );
      const Response = await Fetch_Post_Data.json();
      setpostState(Response.posts);
    };
    FetchFunction();
  }, []);
  const Like_and_Comment_Function = async (item, type) => {
    try {
      if (type == "like") {
        socket.emit("like_listen", {
          type: "like",
          array_emenent_id: item?._id,
          recever_id: localStorage.getItem("id"),
          sender_id: localStorage.getItem("id"),
          name: User_information[0]?.name,
          profilePic: User_information[0]?.profilePic,
        });
      } else if (type == "dislike") {
        socket.emit("like_listen", {
          type: "dislike",
          recever_id: localStorage.getItem("id"),
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
            recever_id: localStorage.getItem("id"),
            sender_id: localStorage.getItem("id"),
            name: User_information[0]?.name,
            content: CommentContentState,
            profilePic: User_information[0]?.profilePic,
          });
          setCommentContentState("");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const DeletePost = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be delete the Post!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setpostState((prev) => {
            const Updated = prev?.filter((post) => post._id != item._id);
            return Updated;
          });
          await axios.post(`${Backend_Path()}/home/feed/delete-post`, {
            user_id: localStorage.getItem("id"),
            post_id: item._id,
          });
        } catch (err) {
          toast.error("Server Error");
          console.log(err);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Post has been deleted.",
          icon: "success",
        });
      }
    });
  };

  useEffect(() => {
    socket.on("like_update", (Data) => {
      if (Data.type == "like") {
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
  }, [socket]);
  return (
    <>
      {postState?.length > 0 ? (
        postState?.map((item, index) => {
          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow p-4 mb-4 w-full`}
            >
              <div className="flex justify-between">
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
                <div
                  className="relative h-fit"
                  onClick={() =>
                    setisPoseDeleteOpen((prev) => {
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
                    })
                  }
                >
                  <BsThreeDotsVertical className="cursor-pointer" />
                  <div
                    className={`absolute cursor-pointer flex items-center justify-center -bottom-6 -left-11 px-2 text-sm shadow-md text-red-500 rounded-lg font-semibold ${
                      isPoseDeleteOpen.some(
                        (open) => open.user_id == item?._id && open.action
                      )
                        ? "opacity-100 h-fit pointer-events-auto"
                        : "opacity-0 h-0 pointer-events-none"
                    }`}
                    onClick={() => DeletePost(item)}
                  >
                    Delete
                  </div>
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
                        className="rounded-lg shrink-0 md:w-[49%] h-full border-2"
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
                    (open) => open.user_id == item?._id && open.action
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
                        <div class="flex relative my-4">
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
          );
        })
      ) : (
        <h1 className="text-center text-gray-400 m-2 mb-4">
          No post available
        </h1>
      )}
    </>
  );
};
