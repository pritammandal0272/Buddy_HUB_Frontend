import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoryLine } from "../Inner_Components/Feed_Components/StoryLine";
import { FcPrevious } from "react-icons/fc";
import { FaXmark } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import blank_profile_img from "../../assets/Images/black_profile.jpg";
import { FcNext } from "react-icons/fc";
import Groups_Img from "../../assets/Images/Groups_Img.png";
export const StorySeen = () => {
  const location = useLocation();
  const nagivate = useNavigate();
  const ChangeStatusOuterRef = useRef(location.state.index);
  const [ChangeStatusInner, setChangeStatusInner] = useState(0);
  const [RestartStatus, setRestartStatus] = useState(1);
  const StopIntervalref = useRef();
  // console.log(location.state.OtherStory[ChangeStatusOuterRef.current]);
  useEffect(() => {
    StopIntervalref.current = setInterval(() => {
      setChangeStatusInner((prevInner) => {
        if (
          prevInner ==
          location.state.OtherStory[ChangeStatusOuterRef.current].story.length -
            1
        ) {
          if (
            ChangeStatusOuterRef.current ==
            location.state.OtherStory.length - 1
          ) {
            nagivate("/feed");
            clearInterval(StopIntervalref.current);
          } else {
            ChangeStatusOuterRef.current = ChangeStatusOuterRef.current + 1;
          }
          return 0;
        } else {
          return prevInner + 1;
        }
      });
    }, 10000);
    return () => clearInterval(StopIntervalref.current);
  }, [RestartStatus]);
  useEffect(() => {
    console.log(ChangeStatusInner);
  }, [ChangeStatusInner]);
  const Next_Status_Function = () => {
    setChangeStatusInner((prevInner) => {
      if (
        prevInner ==
        location.state.OtherStory[ChangeStatusOuterRef.current].story.length - 1
      ) {
        if (
          ChangeStatusOuterRef.current ==
          location.state.OtherStory.length - 1
        ) {
          nagivate("/feed");
          clearInterval(StopIntervalref.current);
        } else {
          ChangeStatusOuterRef.current = ChangeStatusOuterRef.current + 1;
        }
        return 0;
      } else {
        return prevInner + 1;
      }
    });
    clearInterval(StopIntervalref.current);
    setRestartStatus((prev) => prev + 1);
  };
  const Prev_Status_Function = () => {
    setChangeStatusInner((prevInner) => {
      if (prevInner == 0) {
        toast.error("No Status Found");
        return 0;
      } else {
        return prevInner - 1;
      }
    });
    clearInterval(StopIntervalref.current);
    setRestartStatus((prev) => prev + 1);
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);
  return (
    <>
      <div className=" w-full h-[100vh] pt-[13vh] md:pt-[9vh] md:pl-[17em] pb-4">
        <Toaster />
        <div className="w-full h-full bg-black rounded-md relative flex flex-col items-center justify-center">
          <StoryLine ChangeStatusInner={ChangeStatusInner} />
          <div
            className="text-red-500 cursor-pointer absolute top-2 right-2 text-xl shadow-lg p-2 bg-slate-200 rounded-full"
            onClick={() => nagivate("/feed")}
          >
            <FaXmark />
          </div>
          <div className="w-full h-10 bg-red-500 absolute flex items-center justify-between px-5 bg-transparent text-white">
            <div
              className="cursor-pointer text-xl"
              onClick={() => Prev_Status_Function()}
            >
              <FcPrevious />
            </div>
            <div
              className="cursor-pointer text-xl"
              onClick={() => Next_Status_Function()}
            >
              <FcNext />
            </div>
          </div>
          {location?.state?.OtherStory[ChangeStatusOuterRef.current]?.story[
            ChangeStatusInner
          ]?.catagory == "text" ? (
            <div
              className="md:w-[40%] w-full h-[100%] bg-no-repeat bg-cover p-2"
              style={{
                backgroundColor:
                  location?.state?.OtherStory[ChangeStatusOuterRef.current]
                    ?.story[ChangeStatusInner]?.bgcolor,
              }}
            >
              <Link
                className="flex items-center gap-2  mb-4 text-white"
                to={"/view-other-profile"}
                state={{
                  user_id:
                    location?.state?.OtherStory[ChangeStatusOuterRef.current]
                      ?.user_id,
                }}
              >
                <img
                  src={
                    location?.state?.OtherStory[ChangeStatusOuterRef.current]
                      ?.profilePic == ""
                      ? blank_profile_img
                      : location?.state?.OtherStory[
                          ChangeStatusOuterRef.current
                        ]?.profilePic
                  }
                  alt={"Loading"}
                  className="w-10 h-10 rounded-full border-2 border-black"
                />
                <div>
                  <h3 className="font-semibold">
                    {
                      location?.state?.OtherStory[ChangeStatusOuterRef.current]
                        .name
                    }
                  </h3>
                  <div className="flex w-fit items-center gap-1 font-bold bg-slate-200 px-2 rounded-lg cursor-pointer">
                    <img
                      src={Groups_Img}
                      alt=""
                      className="h-[20px] w-[20px]"
                    />
                    <span className="text-sm text-black">Friends</span>
                  </div>
                </div>
              </Link>
              <div className="text-[20px] text-white h-[95%] pb-24  flex items-center justify-center">
                {
                  location?.state?.OtherStory[ChangeStatusOuterRef.current]
                    ?.story[ChangeStatusInner]?.content
                }
              </div>
            </div>
          ) : (
            <div
              className="md:w-[40%] bg-[#00000050] w-full h-[100%] bg-no-repeat bg-cover p-2"
              // style={{
              //   backgroundImage: `url(${
              //     location?.state?.OtherStory[ChangeStatusOuterRef.current]
              //       ?.story[ChangeStatusInner]?.content
              //   })`,
              // }}
            >
              <div className="flex items-center gap-3 mb-4 text-white">
                <img
                  src={
                    location?.state?.OtherStory[ChangeStatusOuterRef.current]
                      ?.profilePic == ""
                      ? blank_profile_img
                      : location?.state?.OtherStory[
                          ChangeStatusOuterRef.current
                        ]?.profilePic
                  }
                  alt={"Loading..."}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">
                    {
                      location?.state?.OtherStory[ChangeStatusOuterRef.current]
                        ?.name
                    }
                  </h3>
                  <div className="flex w-fit items-center gap-1 font-bold bg-slate-200 px-2 rounded-lg cursor-pointer">
                    <img
                      src={Groups_Img}
                      alt=""
                      className="h-[20px] w-[20px]"
                    />
                    <span className="text-sm text-black">Friends</span>
                  </div>
                </div>
              </div>
              <div className="text-[20px] text-white h-[95%] pb-24  flex items-center justify-center">
                <img
                  src={
                    location?.state?.OtherStory[ChangeStatusOuterRef.current]
                      ?.story[ChangeStatusInner]?.content
                  }
                  alt=""
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
