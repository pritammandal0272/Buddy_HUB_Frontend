import React from "react";
import "./FullPage_Loader.css";
import logo from "../assets/Images/logo1.jpg";
import logo1 from "../assets/Images/logo.png";
export const FullPage_Loader = () => {
  return (
    <>
      <div className="bg-white fixed top-0 z-[1000] w-full h-full left-0 flex items-center justify-center">
        {/* Image Over the Loader */}
        <div className="absolute  flex-col -space-y-2 overflow-hidden flex justify-center items-center">
          <img src={logo} alt="Logo" className="w-30 h-20 z-20" />
          <img src={logo1} alt="Logo" className="w-40 animate-pulse" />
        </div>
        <footer class=" absolute bottom-2 md:right-0 flex items-center justify-center w-full md:block md:w-fit">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row justify-between items-center">
              <p class="text-sm sm:text-base text-center sm:text-left">
                <span class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] via-[#ee0979] to-[#ff6a00] animate-gradient">
                 Designed & Developed by Pritam © 2025
                </span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
