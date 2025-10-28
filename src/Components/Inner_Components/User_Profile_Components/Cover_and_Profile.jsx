import React, { useContext, useEffect, useRef } from "react";
import { FaEllipsisH } from "react-icons/fa";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import coverimage from "../../../assets/Images/cover_image.jpg";
import { FaCamera } from "react-icons/fa";
import { useState } from "react";
import { Preview_Profile_Page } from "./Preview_Profile_Page";
import axios from "axios";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import toast, { Toaster } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import Swal from "sweetalert2";
import { Backend_Path } from "../../../Backend_Path";
export const Cover_and_Profile = () => {
  const { User_information, setUser_information } = useContext(BranchStoreApi);
  const [isPreviewOpen, setisPreviewOpen] = useState(false);
  const [inputData, setinputData] = useState();
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const [delete_or_upload_popUp, setdelete_or_upload_popUp] = useState(false);
  const [
    delete_or_upload_popUp_for_cover,
    setdelete_or_upload_popUp_for_cover,
  ] = useState(false);
  const Flagref = useRef("");
  const ProfilePhotoChange = (e, type) => {
    console.log(type);
    if (type == "profile") {
      const Data = e.target.files[0];
      setinputData(Data);
      Flagref.current = type;
      setisPreviewOpen(true);
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be delete the profile image !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const UpdatedData = await axios.post(
            `${Backend_Path()}/home/delete-profile-photo${localStorage.getItem(
              "id"
            )}`,
            { type: "profile" }
          );
          const Data = [
            UpdatedData.data,
            User_information[1],
            User_information[2],
          ];
          setUser_information(Data);
          setdelete_or_upload_popUp(false);
          Swal.fire({
            title: "Deleted!",
            text: "Profile image has been deleted.",
            icon: "success",
          });
        }
      });
    }
  };
  const InsertImage_DB = async () => {
    const fromData = new FormData();
    try {
      setisLoaderOpen(true);
      fromData.append("image", inputData);
      const ImageUpload = await fetch(`http://127.0.0.1:5000/home/upload`, {
        method: "POST",
        body: fromData,
      });
      const Response = await ImageUpload.json();
      const LocalStorage_id = localStorage.getItem("id");
      const ChangeProfile_Photo_Response = await axios.post(
        `http://127.0.0.1:5000/home/update-profile-photo${LocalStorage_id}`,
        {
          type: Flagref.current,
          image: Response[0].path,
        }
      );
      const DataUser = [
        ChangeProfile_Photo_Response.data,
        User_information[1],
        User_information[2],
      ];
      setUser_information(DataUser);

      setisPreviewOpen(false);
      setisLoaderOpen(false);
      setdelete_or_upload_popUp(false);
      toast.success("Profile Image Upload Successfully!");
    } catch (error) {
      setisPreviewOpen(false);
      setisLoaderOpen(false);
      setdelete_or_upload_popUp(false);
      setdelete_or_upload_popUp_for_cover(false);
      console.log(error);
      toast.error("Server Error!");
    }
  };
  const CoverPhotoChange = (e, type) => {
    if (type == "cover") {
      const Data = e.target.files[0];
      setinputData(Data);
      Flagref.current = type;
      setisPreviewOpen(true);
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be delete the profile image !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const UpdatedData = await axios.post(
            `${Backend_Path()}/home/delete-profile-photo${localStorage.getItem(
              "id"
            )}`,
            { type: "cover" }
          );
          const Data = [
            UpdatedData.data,
            User_information[1],
            User_information[2],
          ];
          setUser_information(Data);
          setdelete_or_upload_popUp_for_cover(false);
          Swal.fire({
            title: "Deleted!",
            text: "Profile image has been deleted.",
            icon: "success",
          });
        }
      });
    }
  };
  useEffect(() => {
    const ScrollFunction = () => {
      if (window.scrollY + window.innerHeight > window.innerHeight) {
        setdelete_or_upload_popUp((prev) => (prev ? false : false));
        setdelete_or_upload_popUp_for_cover((prev) => (prev ? false : false));
      }
    };
    window.addEventListener("scroll", ScrollFunction);
    return () => window.removeEventListener("scroll", ScrollFunction);
  });
  return (
    <>
      <div className="relative">
        <Toaster />
        <Preview_Profile_Page
          User_information={User_information}
          setisPreviewOpen={setisPreviewOpen}
          isPreviewOpen={isPreviewOpen}
          inputData={inputData}
          Flagref={Flagref}
          InsertImage_DB={InsertImage_DB}
          isLoaderOpen={isLoaderOpen}
        />
        <div className="h-[30vh] overflow-hidden">
          <img
            src={
              User_information[0]?.coverPhoto == ""
                ? coverimage
                : User_information[0]?.coverPhoto
            }
            alt="Cover"
            className="w-full h-[100%] rounded-tl-md rounded-tr-md"
          />
          {/* ==============Popup Box Start for Cover========= */}
          <div
            class={`absolute md:top-20 top-28 right-10 rounded-br-none shadow-md md:right-10 w-fit max-h-full ${
              delete_or_upload_popUp_for_cover ? "block" : "hidden"
            }`}
          >
            <div class="relative bg-white rounded-br-none rounded-lg shadow-sm">
              <button type="button" class="float-right p-1 absolute right-0">
                <IoMdClose
                  className="text-xl text-red-400"
                  onClick={() => setdelete_or_upload_popUp_for_cover(false)}
                />
              </button>
              <div class="p-2 pt-7 flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <label
                    htmlFor="ImageChooseCover"
                    className="cursor-pointer w-full h-full flex gap-1"
                  >
                    <MdOutlineDriveFolderUpload className="text-[20px] text-green-500" />
                    <div class="text-white bg-green-600 hover:bg-green-800 font-medium rounded-lg text-sm items-center text-center h-6 w-16 px-2">
                      Upload
                    </div>
                  </label>
                  <input
                    type="file"
                    className="absolute top-0 cursor-pointer hidden"
                    id="ImageChooseCover"
                    accept="image/*"
                    onChange={(e) => CoverPhotoChange(e, "cover")}
                  />
                </div>
                <div className="flex items-center gap-1 cursor-pointer">
                  <MdDeleteOutline className="text-[20px] text-red-500" />
                  <button
                    type="button"
                    class="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm items-center text-center h-6 w-16 px-2"
                    onClick={(e) => CoverPhotoChange(e, "delete")}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ==============Popup Box End for Cover========= */}
          <div
            className="absolute bottom-[45%] right-3 p-2 bg-gray-600 rounded-full cursor-pointer"
            onClick={() => setdelete_or_upload_popUp_for_cover(true)}
          >
            <div className="w-full h-full relative">
              <FaCamera className="text-slate-300 cursor-pointer z-10" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 top-[35%] left-8 transform">
          <img
            src={
              User_information[0]?.profilePic == ""
                ? blank_profile_img
                : User_information[0]?.profilePic
            }
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-white"
          />
          {/* ==============Popup Box Start for Profile========= */}
          <div
            class={`absolute top-6 md:top-1 md:-right-20 -right-24 w-fit max-h-full ${
              delete_or_upload_popUp ? "block" : "hidden"
            }`}
          >
            <div class="relative bg-white rounded-t-lg rounded-tl-lg rounded-br-lg shadow-md  z-[1000]">
              <button type="button" class="float-right p-1 absolute right-0">
                <IoMdClose
                  className="text-xl text-red-400"
                  onClick={() => setdelete_or_upload_popUp(false)}
                />
              </button>
              <div class="p-2 pt-7 flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <label
                    htmlFor="ImageChooseProfile"
                    className="cursor-pointer w-full h-full flex gap-1"
                  >
                    <MdOutlineDriveFolderUpload className="text-[20px] text-green-500" />
                    <div class="text-white bg-green-600 hover:bg-green-800 font-medium rounded-lg text-sm items-center text-center h-6 w-16 px-2">
                      Upload
                    </div>
                  </label>
                  <input
                    type="file"
                    className="absolute top-0 cursor-pointer hidden"
                    id="ImageChooseProfile"
                    accept="image/*"
                    onChange={(e) => ProfilePhotoChange(e, "profile")}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <MdDeleteOutline className="text-[20px] text-red-500" />
                  <div
                    class="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm items-center text-center h-6 w-16 px-2 cursor-pointer"
                    onClick={(e) => ProfilePhotoChange(e, "delete")}
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ==============Popup Box End for Profile========= */}
          <div
            className="absolute bottom-[45%] right-0 p-2 bg-gray-600 rounded-full cursor-pointer"
            onClick={() => setdelete_or_upload_popUp(true)}
          >
            <div className="w-full h-full relative">
              <div className="cursor-pointer w-full h-full">
                <FaCamera className="text-slate-300 cursor-pointer z-10" />
              </div>
            </div>
          </div>
        </div>
        <div className="h-[20vh] flex flex-col justify-end p-5">
          <h1 className="text-3xl font-bold">{User_information[0]?.name}</h1>
          <p className="text-gray-600">{User_information[0]?.bio}</p>
        </div>
      </div>
    </>
  );
};
