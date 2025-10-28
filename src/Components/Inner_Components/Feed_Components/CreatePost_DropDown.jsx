import React, { useEffect, useRef, useState } from "react";
import profile from "../../../assets/Images/profile.jpg";
import Groups_Img from "../../../assets/Images/Groups_Img.png";
import Home from "../../../assets/Images/Home.png";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Backend_Path } from "../../../Backend_Path";
import axios from "axios";
import { Loader } from "../../Loader/Loader";
import toast, { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import photoLogo from "../../../assets/Images/photoLogo.png";
export const CreatePost_DropDown = ({
  setIsOpen,
  isOpen,
  setAdd_Frist_OwnPost,
}) => {
  const { User_information, re_RenderState, setre_RenderState } =
    useContext(BranchStoreApi);
  const navigate = useNavigate();
  const [postImage, setpostImage] = useState([]);
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const CaragoryPostRef = useRef("text");
  const [ContentText, setContentText] = useState({
    content: "",
  });
  const ColorList = [
    "red",
    "blue",
    "green",
    "pink",
    "yellow",
    "silver",
    "black",
    "tomato",
  ];
  const [TextAreaBgcolor, setTextAreaBgcolor] = useState("white");
  const AddImageFunction = (ImageURL) => {
    setpostImage((prev) => [...prev, ImageURL]);
  };
  const DeleteImageFrom_postImage = (Item) => {
    // console.log(Index);
    const NewArray = postImage.filter((item) => {
      if (item != Item) {
        // console.log(index);

        return item;
      }
    });
    setpostImage(NewArray);
  };
  const SubmitPost = async () => {
    // console.log("hi", User_information[0].name, User_information[0].profilePic);
    try {
      const Local_Host_Id = localStorage.getItem("id");
      setisLoaderOpen(true);
      // console.log(CaragoryPostRef.current);
      if (CaragoryPostRef.current == "image") {
        if (postImage?.length == 0) {
          toast.error("You can't set Image or Text");
          return;
        }
        const formData = new FormData();

        // safe check
        if (Array.isArray(postImage)) {
          postImage.forEach((file) => formData.append("image", file));
        } else if (postImage) {
          formData.append("image", postImage);
        }
        const InsertPostOn_DB_Fetch = await fetch(
          `${Backend_Path()}/home/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const InsertPostOn_DB_Fetch_Response =
          await InsertPostOn_DB_Fetch.json();
        // console.log("Uploaded", InsertPostOn_DB_Fetch_Response);
        let AllImagePath_Array = [];
        InsertPostOn_DB_Fetch_Response.map((item) => {
          AllImagePath_Array.push(item.path);
        });
        console.log(AllImagePath_Array, ContentText.content);
        const Data = await axios.post(
          `${Backend_Path()}/home/create-post-inser-db`,
          {
            user_id: Local_Host_Id,
            content: ContentText.content,
            catagory: CaragoryPostRef.current,
            ImageArray: AllImagePath_Array,
          }
        );
        setAdd_Frist_OwnPost({
          user_id: Local_Host_Id,
          name: User_information[0]?.name,
          content: ContentText.content,
          catagory: CaragoryPostRef.current,
          profilePic: User_information[0]?.profilePic,
          image: AllImagePath_Array,
          time: "now",
          array_emenent_id: Data?.data?.posts[0]?._id,
          likes: [],
          comments: [],
        });
      } else {
        if (ContentText.content == "") {
          toast.error("You can't set Image or Text");
          return;
        }

        const Data = await axios.post(
          `${Backend_Path()}/home/create-post-inser-db`,
          {
            user_id: Local_Host_Id,
            content: ContentText.content,
            catagory: CaragoryPostRef.current,
            bg_color: TextAreaBgcolor,
          }
        );
        // console.log(Data.data.posts[0]._id);

        setAdd_Frist_OwnPost({
          user_id: Local_Host_Id,
          name: User_information[0]?.name,
          content: ContentText.content,
          profilePic: User_information[0]?.profilePic,
          catagory: CaragoryPostRef.current,
          bg_color: TextAreaBgcolor,
          time: "now",
          array_emenent_id: Data?.data?.posts[0]?._id,
          likes: [],
          comments: [],
        });
      }
      toast.success("Upload Successfully");
      setisLoaderOpen(false);
      setIsOpen(false);
      setContentText({
        content: "",
      });
      setre_RenderState((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
      setpostImage([]);
      setisLoaderOpen(false);
      setIsOpen(false);
      setContentText({
        content: "",
      });
    }
    // navigate("/view-profile", { state: postImage });
  };
  useEffect(() => {
    postImage?.length > 0
      ? (CaragoryPostRef.current = "image")
      : (CaragoryPostRef.current = "text");
  }, [postImage]);
  const TeatAreaFunction = (e) => {
    setContentText((prev) => ({ ...prev, content: e.target.value }));
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
      {/* create post dialog box */}
      <Loader isLoaderOpen={isLoaderOpen} />
      <div
        className={`flex items-center fixed justify-center z-50 bg-black bg-opacity-50 create_post_dialog_box transition-opacity duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`relative bg-[#f0f2f5] w-[95%] pb-2 md:w-[50%] md:h-fit h-[90%] flex flex-col justify-between rounded-lg transform transition-all duration-300 ease-in-out ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="flex justify-center relative border-b-2">
            <div className="w-full flex p-3 items-center justify-center text-xl font-bold">
              <p>Create Post</p>
            </div>
            <div className="absolute right-0 p-2">
              <button
                className="bg-gray-200 p-2 shadow-sm border border-gray-400 hover:bg-gray-300 rounded-full text-gray-500"
                onClick={() => {
                  setIsOpen(false);
                  setContentText({
                    content: "",
                  });
                  setpostImage([]);
                  setTextAreaBgcolor("white");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            className="my-2 px-4 flex items-center space-x-2"
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
              alt=""
            />
            <div>
              <h3 className="font-bold text-lg">{User_information[0]?.name}</h3>
              {/* author friends dropdown  */}

              <div className="flex items-center space-x-1 bg-gray-300 font-bold px-1 py-1 rounded-lg cursor-pointer">
                <img src={Groups_Img} alt="" className="h-[20px] w-[20px]" />
                <span className="text-sm">Friends</span>
              </div>
            </div>
          </div>

          {/* create post interface */}
          <div className="px-4 py-2 h-[80%] flex flex-col justify-between">
            <div className={`mb-4 h-full`}>
              <textarea
                className={`w-full shadow-md rounded-md p-2 ${
                  postImage.length == 0 ? "h-full" : "h-12"
                } ${
                  TextAreaBgcolor == "white" || TextAreaBgcolor == "yellow"
                    ? "placeholder-black"
                    : "placeholder-white"
                } text-xl focus:outline-none `}
                style={{
                  backgroundColor: `${TextAreaBgcolor}`,
                  color: `${
                    TextAreaBgcolor == "white" || TextAreaBgcolor == "yellow"
                      ? "black"
                      : "white"
                  }`,
                }}
                rows={`${postImage.length == 0 ? "6" : "1"}`}
                placeholder={`What's on your mind ${
                  User_information[0]?.name?.split(" ")[0]
                } ?`}
                value={ContentText.content}
                onChange={(e) => TeatAreaFunction(e)}
              />
              <div
                className={`w-full h-full overflow-auto flex shadow-md rounded-md justify-between flex-wrap ${
                  postImage.length == 0 ? null : "max-h-[20em]"
                }`}
              >
                {postImage.map((items) => {
                  return (
                    <div className="relative w-full h-fit">
                      <img
                        src={URL.createObjectURL(items)}
                        alt=""
                        className={`w-full shrink-0`}
                      />
                      <IoMdCloseCircleOutline
                        className="absolute top-2 right-2 text-2xl cursor-pointer text-red-600"
                        onClick={() => DeleteImageFrom_postImage(items)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 md:gap-2 items-center">
                  <img
                    className="h-11"
                    src="https://www.facebook.com/images/composer/SATP_Aa_square-2x.png"
                    alt="image pallete"
                  />
                  {ColorList.map((items, index) => {
                    return (
                      <div
                        key={index}
                        className={`p-2 shadow-md rounded-md h-8 w-8 cursor-pointer`}
                        style={{ backgroundColor: `${items}` }}
                        onClick={() => setTextAreaBgcolor(items)}
                      ></div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-xl border-2 p-2 flex justify-between items-center">
                <p className="font-semibold">Add to your Post</p>
                <div className="flex gap-2">
                  <button className="flex shadow-md items-center relative bg-gray-200 py-[2px] gap-1 px-2 rounded-3xl text-gray-600 cursor-pointer">
                    <img src={photoLogo} alt="" className="h-[18px] w-[18px]" />
                    Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute h-full w-full top-0 left-0 z-10 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        AddImageFunction(e.target.files[0]);
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2 px-4">
            <button
              className="cursor-pointer shadow-md text-center w-full py-2 rounded-lg bg-blue-500 text-white"
              onClick={() => {
                SubmitPost();
              }}
            >
              Post
            </button>
          </div>
          {/* </Dialog.Description> */}
        </div>
      </div>
      {/* </Dialog> */}
    </>
  );
};
