import React, { useContext, useState } from "react";
import { StoryPopup } from "../Feed_Components/StoryPopup";
import { useNavigate } from "react-router-dom";
import { BranchStoreApi } from "../../../BranchStore/BranchStore";
import { FaPlus } from "react-icons/fa6";
import blank_profile_img from "../../../assets/Images/black_profile.jpg";
import { useEffect } from "react";
import { Backend_Path } from "../../../Backend_Path";
import axios from "axios";
export const Create_Story = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { StoryData } = useContext(BranchStoreApi);
  const [OtherStoryDetails, setOtherStoryDetails] = useState([]);
  const { User_information } = useContext(BranchStoreApi);
  const StorySeenFun = (Index) => {
    // const FilterEmptyStory = OtherStoryDetails?.filter((item) => {
    //   return item?.story?.length != 0;
    // });
    // console.log(FilterEmptyStory);

    navigate("/story-seen", {
      state: {
        OtherStory: OtherStoryDetails,
        index: Index,
      },
    });
  };
  const OwnStorySeenFun = (Index) => {
    let Obj = {
      name: User_information[0].name,
      profilePic: User_information[0].profilePic,
      story: OwnStory,
      user_id: User_information[0].user_id,
    };
    navigate("/story-seen", {
      state: {
        OtherStory: [Obj],
        index: Index,
      },
    });
  };
  const [OwnStory, setOwnStory] = useState([]);
  useEffect(() => {
    // ===========For Own Story Fetch================
    const FetchFunction = async () => {
      const FetchDataOwn = await fetch(
        `${Backend_Path()}/home/story/find-story${localStorage.getItem("id")}`
      );
      const ResponseOwn = await FetchDataOwn.json();
      let Array = [];
      for (let i = 0; i < ResponseOwn.length; i++) {
        Array.push(ResponseOwn[i]?.story);
      }
      setOwnStory(Array);
    };
    FetchFunction();
  }, [isOpen]);
  useEffect(() => {
    const FetchFunctions = async () => {
      // ===========For User Friends Fetch================
      const FetchDataFriends = await fetch(
        `${Backend_Path()}/home/find-user-friends${localStorage.getItem("id")}`
      );
      const ResponseFriends = await FetchDataFriends.json();
      // console.log(ResponseFriends);
      const Array_Only_Id = [];
      ResponseFriends?.friends.map((item) => {
        Array_Only_Id.push(item.id);
      });
      // console.log(Array_Only_Id);
      // ===========For Friends Story Fetch================

      const Friends_Story_Data = await axios.post(
        `${Backend_Path()}/home/story/find-story-array`,
        Array_Only_Id
      );
      // console.log("Story", Friends_Story_Data.data);

      // ===========For Other Story User Information Fetch using Array_Only_Id Array================
      const Find_OtherStory_User_information_Model = await axios.post(
        `${Backend_Path()}/home/friend-recever-data-information-model`,
        Array_Only_Id
      );
      // console.log("Friends:", Find_OtherStory_User_information_Model.data);
      const Join_UserStory_UserInformation = [];
      for (
        let i = 0;
        i < Find_OtherStory_User_information_Model.data.length;
        i++
      ) {
        let NewArray = [];
        // console.log(
        //  Friends_Story_Data?.data[i]?.user_id
        // );
        for (let j = 0; j < Friends_Story_Data.data.length; j++) {
          if (
            String(Find_OtherStory_User_information_Model?.data[i]?.user_id) ==
            String(Friends_Story_Data?.data[j]?.user_id)
          ) {
            NewArray.push(Friends_Story_Data?.data[j].story);
          }
        }
        const NewObj = {
          user_id: Find_OtherStory_User_information_Model?.data[i]?.user_id,
          name: Find_OtherStory_User_information_Model?.data[i]?.name,
          profilePic:
            Find_OtherStory_User_information_Model?.data[i]?.profilePic,
          story: NewArray,
        };
        setOtherStoryDetails((prev) => [...prev, NewObj]);
      }
    };
    FetchFunctions();
  }, []);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [OwnStory]);
  return (
    <>
      <div className="w-full h-fit shrink-0 overflow-scroll Scroll">
        <div className="flex space-x-2 max-w-2xl relative w-fit mt-6 md:mt-0">
          {/* <!-- Create Story --> */}
          <div
            className="w-30 h-40 shadow-lg rounded-xl shrink-0 overflow-hidden flex flex-col group cursor-pointer relative "
            onClick={() => setIsOpen(true)}
          >
            <img
              className="w-full h-4/5 object-cover transition duration-300 ease-in-out transform group-hover:scale-105"
              src={
                User_information[0]?.profilePic == ""
                  ? blank_profile_img
                  : User_information[0]?.profilePic
              }
            />

            <div className="bg-gray-800 relative flex-1 flex flex-col">
              <div className="bg-blue-600 p-0.5 rounded-full border-4 border-gray-800 absolute left-1/2 transform -translate-x-1/2 -translate-y-5">
                <FaPlus className="text-white text-2xl" />
              </div>
              <div className="flex-1 pb-1 text-white text-sm font-semibold capitalize flex justify-center items-end">
                <p>Create Story</p>
              </div>
            </div>

            <div className="absolute inset-0 bg-black opacity-0 transition duration-300 ease-in-out group-hover:opacity-20"></div>
          </div>

          {/* <!-- Your Story --> */}
          {OwnStory?.length > 0 ? (
            <div
              className="w-30 h-40 shrink-0 rounded-xl overflow-hidden flex flex-col relative group cursor-pointer"
              onClick={() => {
                return OwnStorySeenFun(0);
              }}
            >
              {OwnStory[0]?.catagory == "text" ? (
                <div
                  className="w-[7em] h-full object-cover transition duration-300 ease-in-out transform group-hover:scale-105 flex items-center justify-center p-6"
                  style={{ backgroundColor: OwnStory[0]?.bgcolor }}
                >
                  <p className="text-[12px] overflow-hidden text-white text-ellipsis whitespace-nowrap">
                    {OwnStory[0]?.content}
                  </p>
                  <div className="clippy absolute bottom-0 left-0 top-0 right-0 bg-gray-800 bg-opacity-50 p-4 text-white flex flex-col justify-end items-center"></div>
                </div>
              ) : (
                <img
                  className="w-[7em] h-full object-cover transition duration-300 ease-in-out transform group-hover:scale-105"
                  src={OwnStory[0]?.content}
                  alt="Story"
                />
              )}
              <div className="w-8 h-8 border-4 box-content border-gray-800 rounded-full overflow-hidden absolute left-2.5 top-3">
                <img
                  className="w-full h-full object-cover"
                  src={
                    User_information[0]?.profilePic == ""
                      ? blank_profile_img
                      : User_information[0]?.profilePic
                  }
                  alt="User"
                />
              </div>

              <div className="absolute inset-x-3 bottom-1">
                <p className="text-white font-semibold">Your Story</p>
              </div>

              <div className="absolute inset-0 bg-black opacity-0 transition duration-300 ease-in-out group-hover:opacity-20"></div>
            </div>
          ) : null}
          {/* Other Storys Start */}

          {OtherStoryDetails.map((items, index) => {
            return items?.story?.length > 0 ? (
              <div
                key={index}
                className="w-30 h-40 shrink-0 rounded-xl overflow-hidden flex flex-col relative group cursor-pointer"
                onClick={() => {
                  return StorySeenFun(index);
                }}
              >
                {items?.story[0]?.catagory == "text" ? (
                  <div
                    className="w-[7em] h-full object-cover transition duration-300 ease-in-out transform group-hover:scale-105 flex items-center justify-center p-6"
                    style={{ backgroundColor: items?.story[0]?.bgcolor }}
                  >
                    <p className="text-[12px] overflow-hidden text-white text-ellipsis whitespace-nowrap">
                      {items?.story[0]?.content}
                    </p>
                    <div className="clippy absolute bottom-0 left-0 top-0 right-0 bg-gray-800 bg-opacity-50 p-4 text-white flex flex-col justify-end items-center"></div>
                  </div>
                ) : (
                  <img
                    className="w-[7em] h-full object-cover transition duration-300 ease-in-out transform group-hover:scale-105"
                    src={items?.story[0]?.content}
                    alt="Story"
                  />
                )}
                <div className="w-8 h-8 border-4 box-content border-gray-800 rounded-full overflow-hidden absolute left-2.5 top-3">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      items?.profilePic == ""
                        ? blank_profile_img
                        : items?.profilePic
                    }
                    alt="User"
                  />
                </div>

                <div className="absolute inset-x-3 bottom-1">
                  <p className="text-white font-semibold">{items.name}</p>
                </div>

                <div className="absolute inset-0 bg-black opacity-0 transition duration-300 ease-in-out group-hover:opacity-20"></div>
              </div>
            ) : null;
          })}

          {/*  Other Storys End  */}
        </div>
      </div>
      <StoryPopup setIsOpen={setIsOpen} isOpen={isOpen} />
    </>
  );
};
