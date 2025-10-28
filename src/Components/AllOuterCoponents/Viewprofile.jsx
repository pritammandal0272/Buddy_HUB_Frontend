import React, { useEffect, useState } from "react";
import { User_Profile } from "../Inner_Components/User_Profile_Components/User_Profile";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp } from "react-icons/fa6";
export const Viewprofile = () => {
  const [isScrollTop, setisScrollTop] = useState(false);
  const ScrollTop = () => {
    console.log(window.innerHeight);

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
      <div className=" w-full h-[100vh] pt-[13vh] md:pt-[8vh] md:px-[17em]">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <User_Profile />
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
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
