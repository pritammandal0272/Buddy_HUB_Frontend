import React from "react";
import "../../../assets/Styles/style.css";
export const Loader = ({ LoaderState }) => {
  return (
    <>
      <div
        className={`flex-col gap-4 w-full items-center justify-center absolute LoaderSignInPage bg-black opacity-50 h-full z-20 ${
          LoaderState ? "flex" : "hidden"
        }`}
      >
        <div className="w-12 h-12 border-4 text-blue-500 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-500 rounded-full">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="0.5em"
            width="0.5em"
            className="animate-ping"
          >
            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"></path>
          </svg>
        </div>
      </div>
    </>
  );
};
