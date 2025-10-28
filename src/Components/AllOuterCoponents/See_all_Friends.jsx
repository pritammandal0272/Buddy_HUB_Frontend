import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import blank_profile_img from "../../assets/Images/black_profile.jpg";
import { motion, AnimatePresence } from "framer-motion";
export const See_all_Friends = () => {
  const DataFromNavigator = useLocation();
  console.log(DataFromNavigator.state.All_Friends);

  return (
    <>
      <div className=" w-full h-[100vh] pt-[13vh] md:pt-[8vh] md:px-[17em]">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div class="flex flex-wrap gap-4 p-6 justify-center text-lg">
              <h1 className="text-2xl font-semibold font-serif text-gray-500">
                All friends list
              </h1>
              {DataFromNavigator?.state?.All_Friends?.map((friend) => {
                return (
                  <div class="bg-white  cursor-pointer flex-grow text-black border-l-8 border-green-500 rounded-md px-3 py-2 w-full">
                    <div class="flex h-fit w-full gap-2">
                      <div>
                        <NavLink
                          to={"/view-other-profile"}
                          state={{ user_id: friend.user_id }}
                        >
                          <img
                            class="w-16 h-16 rounded-full border border-gray-100 shadow-sm"
                            src={
                              friend?.profilePic == ""
                                ? blank_profile_img
                                : friend?.profilePic
                            }
                            alt="user image"
                          />
                        </NavLink>
                      </div>
                      <div className="h-16 flex flex-col justify-center">
                        <div>
                          <NavLink
                            to={"/view-other-profile"}
                            state={{ user_id: friend.user_id }}
                          >
                            <span class="font-semibold text-gray-800">
                              {friend.name}
                            </span>
                          </NavLink>
                        </div>
                        <p class="text-gray-400 text-sm">{friend.bio}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
