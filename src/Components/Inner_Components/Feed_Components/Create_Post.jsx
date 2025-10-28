import React, { useContext, useState } from "react";
import profile from "../../../assets/Images/profile.jpg";
import Home from "../../../assets/Images/Home.png";
import Groups_Img from "../../../assets/Images/Groups_Img.png";
import "../../../assets/Styles/style.css";
import { CreatePost_DropDown } from "./CreatePost_DropDown";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import photoLogo from "../../../assets/Images/photoLogo.png";
import TextLogo from "../../../assets/Images/TextLogo.png";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import { useNavigate } from "react-router-dom";
export default function CreatePost({ setAdd_Frist_OwnPost }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { User_information } = useContext(BranchStoreApi);
  return (
    <>
      {/* create post card  */}
      <div className="min-fit mt-4">
        <div className="p-4 shadow-md bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <div className="">
              <img
                src={
                  User_information[0]?.profilePic == ""
                    ? blank_profile_img
                    : User_information[0]?.profilePic
                }
                className="w-12 h-12 mr-5 rounded-full"
                alt="Loading..."
                onClick={() => navigate("/view-profile")}
              />
            </div>
            <div
              className=" w-full px-2 md:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <h3 className="md:text-md text-gray-500 w-[90%]  overflow-hidden text-ellipsis whitespace-nowrap break-words">
                Whats on your mind, {User_information[0]?.name} ?
              </h3>
            </div>
          </div>
          <hr className="mt-3 mb-3" />
          <div className="flex gap-2">
            <button
              className="flex items-center bg-gray-200 py-[2px] px-2 gap-1 rounded-3xl text-gray-600"
              onClick={() => setIsOpen(true)}
            >
              <img src={TextLogo} alt="" className="h-[18px] w-[18px]" />
              Photo
            </button>
            <button
              className="flex items-center bg-gray-200 py-[2px] px-2 gap-1 rounded-3xl text-gray-600"
              onClick={() => setIsOpen(true)}
            >
              <img src={photoLogo} alt="" className="h-[18px] w-[18px]" />
              Photo
            </button>
          </div>
        </div>
      </div>
      <CreatePost_DropDown
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        setAdd_Frist_OwnPost={setAdd_Frist_OwnPost}
      />
    </>
  );
}
