import React, { useContext, useState, useRef, useEffect } from "react";
import profile from "../../../assets/Images/profile.jpg";
import Groups_Img from "../../../assets/Images/Groups_Img.png";
import Home from "../../../assets/Images/Home.png";
import { IoCloseSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { Loader } from "../../Loader/Loader";
import { Backend_Path } from "../../../Backend_Path";
import axios from "axios";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import photoLogo from "../../../assets/Images/photoLogo.png";
import TextLogo from "../../../assets/Images/TextLogo.png";
import "../../../assets/Styles/style.css"
import { useNavigate } from "react-router-dom";
export const StoryPopup = ({ setIsOpen, isOpen }) => {
  const [postImage, setpostImage] = useState([]);
  const [StorypostText, setStorypostText] = useState({ content: "" });
  const { User_information } = useContext(BranchStoreApi);
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const StoryContent = useRef("");
  const navigate = useNavigate();
  const StoryType = useRef("text");
  const ColorList = [
    "red",
    "blue",
    "green",
    "pink",
    "yellow",
    "silver",
    "black",
    "tomato",
    "white",
  ];
  const [TextAreaBgcolor, setTextAreaBgcolor] = useState("tomato");

  const AddImageFunction = (e) => {
    const Blob_Path = URL.createObjectURL(e.target.files[0]);
    StoryContent.current = e.target.files[0];
    setpostImage(Blob_Path);
  };

  const InputBoxvalueFunction = (e) => {
    setStorypostText({ content: e.target.value });
  };

  const Submit_POST = async () => {
    try {
      if (StoryType.current === "text") {
        if (StorypostText.content === "") {
          toast.error("You can't set Image or Text");
          return;
        }
        setisLoaderOpen(true);
        await axios.post(`${Backend_Path()}/home/story/insert-story`, {
          user_id: localStorage.getItem("id"),
          story: {
            catagory: "text",
            bgcolor: TextAreaBgcolor,
            content: StorypostText.content,
          },
        });
        setStorypostText({ content: "" });
      } else {
        if (StoryContent.current === "") {
          toast.error("You can't set Image or Text");
          return;
        }
        setisLoaderOpen(true);
        const formData = new FormData();
        formData.append("image", StoryContent.current);
        const uploadRes = await fetch(`${Backend_Path()}/home/upload`, {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        await axios.post(`${Backend_Path()}/home/story/insert-story`, {
          user_id: localStorage.getItem("id"),
          story: {
            catagory: "image",
            content: uploadData[0].path,
          },
        });
        setpostImage([]);
      }
      setisLoaderOpen(false);
      setIsOpen(false);
      toast.success("Upload Story Successfully");
    } catch (err) {
      console.log(err);
      setisLoaderOpen(false);
      setIsOpen(false);
      toast.error("Server Error");
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);
  return (
    <>
      <Loader isLoaderOpen={isLoaderOpen} />

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 
          transition-opacity duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
      >
        <div
          className={`bg-[#f0f2f5] rounded-lg w-[95%] md:w-[30%] h-fit flex flex-col justify-between 
          transform transition-all duration-300 ease-in-out ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="flex justify-center relative border-b-2">
            <div className="w-full flex p-3 items-center justify-center text-xl font-bold">
              <p>Story Post</p>
            </div>
            <div className="absolute right-0 p-2">
              <button
                className="bg-gray-200 p-2 shadow-sm border border-gray-400 hover:bg-gray-300 rounded-full text-gray-500"
                onClick={() => {
                  setIsOpen(false);
                  setpostImage([]);
                  setTextAreaBgcolor("tomato");
                }}
              >
                <IoCloseSharp className="text-gray-400 text-2xl" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div
            className="my-2 px-4 w-fit flex items-center space-x-2"
            onClick={() => {
              navigate("/view-profile");
            }}
          >
            <img
              src={
                User_information[0]?.profilePic == ""
                  ? blank_profile_img
                  : User_information[0]?.profilePic
              }
              className="w-12 h-12 rounded-full"
              alt="Profile"
            />
            <div>
              <h3 className="font-bold text-lg">
                {User_information[0]?.name || "User"}
              </h3>
              <div className="flex items-center space-x-1 bg-gray-300 font-bold px-1 py-1 rounded-lg cursor-pointer">
                <img
                  src={Groups_Img}
                  alt="Groups"
                  className="h-[20px] w-[20px]"
                />
                <span className="text-sm">Friends</span>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="px-4 py-2">
            {/* Text Mode */}
            <textarea
              className={`w-full text-xl shadow-lg ${
                TextAreaBgcolor == "white" || TextAreaBgcolor == "yellow"
                  ? "placeholder-black"
                  : "placeholder-white"
              } focus:outline-none rounded-md p-2 ${
                postImage?.length === 0 ? "flex" : "hidden"
              }`}
              style={{
                backgroundColor: TextAreaBgcolor,
                color: `${
                  TextAreaBgcolor == "white" || TextAreaBgcolor == "yellow"
                    ? "black"
                    : "white"
                }`,
              }}
              rows="10"
              value={StorypostText.content}
              onChange={(e) => InputBoxvalueFunction(e)}
              placeholder={`What's on your mind ${
                User_information[0]?.name?.split(" ")[0] || ""
              }?`}
            />

            {/* Image Mode */}
            {postImage?.length !== 0 && (
              <div className="relative w-full max-h-80 Scroll overflow-y-auto rounded-md shadow-md">
                <img src={postImage} alt="" className="w-full" />
              </div>
            )}

            {/* Color Picker */}
            <div className="flex items-center md:gap-2 gap-1 mt-4">
              <img
                className="h-11"
                src="https://www.facebook.com/images/composer/SATP_Aa_square-2x.png"
                alt="Palette"
              />
              {ColorList.map((color, index) => (
                <div
                  key={index}
                  className="p-2 shadow-md rounded-md h-8 w-8 cursor-pointer border"
                  style={{ backgroundColor: color }}
                  onClick={() => setTextAreaBgcolor(color)}
                ></div>
              ))}
            </div>

            {/* Buttons */}
            <div className="rounded-xl p-2 flex justify-between items-center pb-0 mt-4">
              <div className="flex w-full items-center justify-between gap-2">
                {/* Text Button */}
                <button
                  className={`flex w-[50%] shadow-md items-center justify-center py-[5px] px-2 gap-1 rounded-md ${
                    postImage?.length === 0
                      ? "bg-green-400 text-white"
                      : "text-gray-600 bg-gray-200"
                  }`}
                  onClick={() => {
                    StoryType.current = "text";
                    setpostImage([]);
                  }}
                >
                  <img src={TextLogo} alt="" className="h-[18px] w-[18px]" />
                  Text
                </button>

                {/* Image Button */}
                <button
                  className={`flex w-[50%] shadow-md items-center justify-center relative gap-1 py-[5px] px-2 rounded-md cursor-pointer ${
                    postImage?.length !== 0
                      ? "bg-green-400 text-white"
                      : "text-gray-600 bg-gray-200"
                  }`}
                >
                  <img src={photoLogo} alt="" className="h-[18px] w-[18px]" />
                  Photo/Video
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute h-full w-full top-0 left-0 z-10 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      StoryType.current = "image";
                      setStorypostText({ content: "" });
                      AddImageFunction(e);
                    }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Post Button */}
          <div className="my-2 mb-5 px-4">
            <button
              className="cursor-pointer shadow-md text-center w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => Submit_POST()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
