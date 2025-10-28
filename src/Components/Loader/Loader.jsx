import React from "react";
import "./Loader.css";
export const Loader = ({ isLoaderOpen }) => {
  return (
    <>
      <div
        className={` transition-all duration-300 flex items-center justify-center ease-in-out fixed top-0 z-[2000] w-full h-full left-0 
        ${
          isLoaderOpen
            ? " opacity-100 pointer-events-auto"
            : "opacity-0 h-0 pointer-events-none"
        }
        `}
      >
        <div id="wifi-loader" className="">
          <svg class="circle-outer" viewBox="0 0 86 86">
            <circle class="back" cx="43" cy="43" r="40"></circle>
            <circle class="front" cx="43" cy="43" r="40"></circle>
            <circle class="new" cx="43" cy="43" r="40"></circle>
          </svg>
          <svg class="circle-middle" viewBox="0 0 60 60">
            <circle class="back" cx="30" cy="30" r="27"></circle>
            <circle class="front" cx="30" cy="30" r="27"></circle>
          </svg>
          <svg class="circle-inner" viewBox="0 0 34 34">
            <circle class="back" cx="17" cy="17" r="14"></circle>
            <circle class="front" cx="17" cy="17" r="14"></circle>
          </svg>
          <div class="text" data-text="Processing"></div>
        </div>
      </div>
    </>
  );
};
