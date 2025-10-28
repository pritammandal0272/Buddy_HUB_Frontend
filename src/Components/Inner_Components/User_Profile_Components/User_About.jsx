import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import logo from "../../../assets/Images/logo1.jpg";
import { PiStudentFill } from "react-icons/pi";
import { GrWorkshop } from "react-icons/gr";
import { IoLocationOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { SiLinuxprofessionalinstitute } from "react-icons/si";
import axios from "axios";
import { Backend_Path } from "../../../Backend_Path";
import toast, { Toaster } from "react-hot-toast";
export const User_About = ({
  isUser_About_Open,
  setisUser_About_Open,
  AboutInformation,
  setAboutInformation,
  setreRenderState,
}) => {
  const [inputBox_Value, setinputBox_Value] = useState({
    work: "",
    education: "",
    location: "",
    nickname: "",
    profession: "",
  });
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  useEffect(() => {
    const Updated_Data = {
      work:
        AboutInformation?.about?.length > 0
          ? AboutInformation?.about[0]?.work == "No Workplace to Show"
            ? ""
            : AboutInformation?.about[0]?.work
          : "",
      education:
        AboutInformation?.about?.length > 0
          ? AboutInformation?.about[0]?.education == "No Education to Show"
            ? ""
            : AboutInformation?.about[0]?.education
          : "",
      location:
        AboutInformation?.about?.length > 0
          ? AboutInformation?.about[0]?.location == "No location to Show"
            ? ""
            : AboutInformation?.about[0]?.location
          : "",
      nickname:
        AboutInformation?.about?.length > 0
          ? AboutInformation?.about[0]?.nickname == "No Nick Name added"
            ? ""
            : AboutInformation?.about[0]?.nickname
          : "",
      profession:
        AboutInformation?.about?.length > 0
          ? AboutInformation?.about[0]?.profession == "No Profession to Show"
            ? ""
            : AboutInformation?.about[0]?.profession
          : "",
    };
    setinputBox_Value(Updated_Data);
  }, [AboutInformation]);
  useEffect(() => {
    if (isUser_About_Open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isUser_About_Open]);
  const InputBoxValueFunction = (e) => {
    const { value, name } = e.target;
    setinputBox_Value((prev) => ({ ...prev, [name]: value }));
  };
  const SaveFrom = async () => {
    setisLoaderOpen(true);
    try {
      await axios.post(
        `${Backend_Path()}/home/about_update${localStorage.getItem("id")}`,
        inputBox_Value
      );

      setreRenderState((prev) => prev + 1);
      setisLoaderOpen(false);
      setisUser_About_Open(false);
      toast.success("Update Successfully");
    } catch (err) {
      console.log(err);
      setisLoaderOpen(false);
      setisUser_About_Open(false);
      toast.success("Server Error");
    }
  };
  return (
    <>
      <div
        className={`fixed z-[1000] flex inset-0 -top-10  p-1 items-center justify-center bg-black bg-opacity-50 
              transition-opacity duration-300 ease-in-out ${
                isUser_About_Open
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
      >
        <Toaster />
        <div
          class={`rounded-lg bg-white p-6 shadow-4 md:w-[40%] w-[95%] transform transition-all duration-300 ease-in-out ${
            isUser_About_Open ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div class="w-full">
            <div className="flex justify-between relative border-b-2">
              <div className=" mb-2">
                <img src={logo} alt="" className="w-20 h-10" />
              </div>
              <div className="w-full flex pb-3 items-center justify-center text-xl font-bold">
                <p>About</p>
              </div>
              <div className="">
                <button
                  className="bg-gray-200 p-2 hover:bg-gray-300 rounded-full text-gray-500"
                  onClick={() => {
                    setisUser_About_Open(false);
                  }}
                >
                  <IoCloseSharp className="text-gray-400 text-2xl" />
                </button>
              </div>
            </div>

            <div class="relative z-0 w mb-5 group mt-5">
              <input
                type="text"
                name="education"
                id="education"
                value={inputBox_Value.education}
                onChange={(e) => {
                  InputBoxValueFunction(e);
                }}
                class="block py-2.5 px-0 w-full text-bla bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="education"
                class="flex items-center gap-1 peer-focus:text-lg absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0  peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <PiStudentFill className="text-xl" />
                Your Education
              </label>
            </div>
            <div class="relative z-0 w mb-5 group">
              <input
                type="text"
                name="work"
                id="work"
                value={inputBox_Value.work}
                onChange={(e) => {
                  InputBoxValueFunction(e);
                }}
                class="block py-2.5 px-0 w-full text-bla bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="work"
                class="flex items-center gap-2 peer-focus:text-lg absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0  peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <GrWorkshop className="text-lg" />
                Work
              </label>
            </div>
            <div class="relative z-0 w mb-5 group">
              <input
                type="text"
                name="location"
                id="location"
                value={inputBox_Value.location}
                onChange={(e) => {
                  InputBoxValueFunction(e);
                }}
                class="block py-2.5 px-0 w-full text-bla bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="location"
                class="flex items-center gap-1 peer-focus:text-lg absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0  peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <IoLocationOutline className="text-xl" />
                Location
              </label>
            </div>
            <div class="relative z-0 w mb-5 group">
              <input
                type="text"
                name="nickname"
                id="nickname"
                value={inputBox_Value.nickname}
                onChange={(e) => {
                  InputBoxValueFunction(e);
                }}
                class="block py-2.5 px-0 w-full text-bla bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="nickname"
                class="flex items-center gap-1 peer-focus:text-lg absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0  peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <MdDriveFileRenameOutline className="text-xl" />
                Nick Name
              </label>
            </div>
            <div class="relative z-0 w mb-5 group">
              <input
                type="text"
                name="profession"
                id="profession"
                value={inputBox_Value.profession}
                onChange={(e) => {
                  InputBoxValueFunction(e);
                }}
                class="block py-2.5 px-0 w-full text-bla bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="profession"
                class="flex items-center gap-1 peer-focus:text-lg absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0  peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <SiLinuxprofessionalinstitute className="text-xl" />
                Profession
              </label>
            </div>

            <div className="w-full flex items-center justify-center">
              <button
                type="submit"
                class="text-white flex items-center justify-center bg-blue-700 hover:bg-blue-800 px-5 py-2.5 text-center rounded-lg"
                onClick={() => {
                  SaveFrom();
                }}
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  class={`inline w-4 h- me-1 text-white animate-spin ${
                    isLoaderOpen ? "flex" : "hidden"
                  }`}
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
