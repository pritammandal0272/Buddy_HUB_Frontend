import React, { useEffect, useState } from "react";
import { FaBriefcase, FaGraduationCap, FaHome } from "react-icons/fa";
import coverimage from "../../../assets/Images/cover_image.webp";
import profile from "../../../assets/Images/profile.jpg";
import { Backend_Path } from "../../../Backend_Path";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import { PiStudentFill } from "react-icons/pi";
import { GrWorkshop } from "react-icons/gr";
import { IoLocationOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { SiLinuxprofessionalinstitute } from "react-icons/si";
import axios from "axios";
import { Link } from "react-router-dom";
import { User_About } from "./User_About";
import "../../../assets/Styles/style.css";
import { Loader } from "../../Loader/Loader";
export const Intro_and_FrindsList = ({ isAllOptionOpen }) => {
  const [allRequstedInformation, setallRequstedInformation] = useState([]);
  const [AboutInformation, setAboutInformation] = useState([]);
  const [isUser_About_Open, setisUser_About_Open] = useState(false);
  const [reRenderState, setreRenderState] = useState(0);

  useEffect(() => {
    const LocalHostId = localStorage.getItem("id");
    const FetchFunction = async () => {
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
    };
    FetchFunction();
  }, []);
  useEffect(() => {
    const FetchFunction = async () => {
      try {
        const FetchData = await fetch(
          `${Backend_Path()}/home/find-user-information${localStorage.getItem(
            "id"
          )}`
        );
        const FetchdataResponse = await FetchData.json();
        // console.log(FetchdataResponse);

        setAboutInformation(FetchdataResponse);
      } catch (err) {
        console.log(err);
      }
    };
    FetchFunction();
  }, [reRenderState]);
  return (
    <>
      <div
        className={`space-y-4 ${
          isAllOptionOpen == "all" || isAllOptionOpen == "friends"
            ? "block"
            : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="font-bold text-xl mb-4 flex justify-between">
            <h1>About</h1>
            <p
              className="text-[15px] font-normal text-[#1877f2] cursor-pointer"
              onClick={() => setisUser_About_Open(true)}
            >
              Edit
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 items-center text-gray-500">
              <PiStudentFill className="text-xl" />
              {AboutInformation?.about?.length > 0
                ? AboutInformation?.about[0]?.education ==
                  "No Education to Show"
                  ? "No Education to Show"
                  : `Studied ${AboutInformation?.about[0]?.education}`
                : null}
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <GrWorkshop className="text-lg" />
              {AboutInformation?.about?.length > 0
                ? AboutInformation?.about[0]?.work == "No Workplace to Show"
                  ? "No Workplace to Show"
                  : `Works at ${AboutInformation?.about[0]?.work}`
                : null}
            </div>
            <div className="flex gap-1 items-center text-gray-500">
              <IoLocationOutline className="text-xl" />
              {AboutInformation?.about?.length > 0
                ? AboutInformation?.about[0]?.location == "No location to Show"
                  ? "No location to Show"
                  : `Lives in ${AboutInformation?.about[0]?.location}`
                : null}
            </div>
            <div className="flex gap-1 items-center text-gray-500">
              <MdDriveFileRenameOutline className="text-xl" />
              {AboutInformation?.about?.length > 0
                ? AboutInformation?.about[0]?.nickname == "No Nick Name added"
                  ? "No Nick Name added"
                  : `Nick Name- ${AboutInformation?.about[0]?.nickname}`
                : null}
            </div>
            <div className="flex gap-1 items-center text-gray-500">
              <SiLinuxprofessionalinstitute className="text-xl" />
              {AboutInformation?.about?.length > 0
                ? AboutInformation?.about[0]?.profession ==
                  "No Profession to Show"
                  ? "No Profession to Show"
                  : `Profession is ${AboutInformation?.about[0]?.profession}`
                : null}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
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
              allRequstedInformation?.length > 0 ? "md:h-[10em]" : "md:h-fit"
            } flex justify-start  overflow-hidden`}
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
                src={profile}
                alt={"Loading...."}
                className="rounded-lg aspect-square object-cover h-[90%]"
              />
              <p className="text-md font-semibold">Pritam Mandal</p>
            </div> */}
          </div>
        </div>
        <User_About
          isUser_About_Open={isUser_About_Open}
          setisUser_About_Open={setisUser_About_Open}
          AboutInformation={AboutInformation}
          setAboutInformation={setAboutInformation}
          setreRenderState={setreRenderState}
        />
      </div>
    </>
  );
};
