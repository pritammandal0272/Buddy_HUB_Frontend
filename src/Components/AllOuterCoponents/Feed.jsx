import React, { useEffect, useState } from "react";
import CreatePost from "../Inner_Components/Feed_Components/Create_Post";
import { Create_Story } from "../Inner_Components/Feed_Components/Create_Story";
import { Post_Components } from "../Inner_Components/Feed_Components/Post_Components";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp } from "react-icons/fa6";
import { FullPage_Loader } from "../../All_Pages/FullPage_Loader";
export const Feed = () => {
  const [Add_Frist_OwnPost, setAdd_Frist_OwnPost] = useState({});
  const [isScrollTop, setisScrollTop] = useState(false);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  const ScrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const ScrollFunction = () => {
      if (window.scrollY + window.innerHeight - 500 > window.innerHeight) {
        setisScrollTop(true);
      } else {
        setisScrollTop(false);
      }
      // console.log(window.scrollY + window.innerHeight > window.innerHeight);
    };
    window.addEventListener("scroll", ScrollFunction);
    return () => window.removeEventListener("scroll", ScrollFunction);
  });
  return (
    <>
      <div className=" w-full relative h-[100vh] md:pt-[10vh] pt-[11vh] px-1 md:px-[17em] bg-[#f0f2f5] flex flex-col gap-3">
        <Toaster />
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div
              className={`fixed animate-bounce transition-all duration-300 ease-in-out bottom-10 right-3 md:bottom-6 cursor-pointer shadow-md md:right-72 z-[1000] bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center 
                ${
                  isScrollTop
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              onClick={() => {
                return ScrollTop();
              }}
            >
              <FaArrowUp />
            </div>
            <Create_Story />

            <CreatePost setAdd_Frist_OwnPost={setAdd_Frist_OwnPost} />
            <Post_Components Add_Frist_OwnPost={Add_Frist_OwnPost} />
          </motion.div>
        </AnimatePresence>
        {/* <FullPage_Loader /> */}
      </div>
    </>
  );
};
