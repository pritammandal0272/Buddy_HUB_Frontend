import React, { useEffect, useState } from "react";
import { Navbar } from "../Components/AllOuterCoponents/Navbar";
import { Left_Side_Bar } from "../Components/AllOuterCoponents/Left_Side";
import { Right_Side_Bar } from "../Components/AllOuterCoponents/Right_Side";
import { Outlet } from "react-router-dom";
import { FullPage_Loader } from "../All_Pages/FullPage_Loader";
const App = () => {
  const [isLoaderOpen, setIsLoaderOpen] = useState(() => {
    return sessionStorage.getItem("loading") !== "false";
  });

  useEffect(() => {
    const startTime = Date.now();

    const handlePageLoad = () => {
      const loadTime = Date.now() - startTime;
      const remainingTime = 4000 - loadTime;

      if (remainingTime > 0) {
        setTimeout(() => {
          setIsLoaderOpen(false);
          sessionStorage.setItem("loading", "false");
        }, remainingTime);
      } else {
        setIsLoaderOpen(false);
        sessionStorage.setItem("loading", "false");
      }
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
      return () => window.removeEventListener("load", handlePageLoad);
    }
  }, []);

  return (
    <>
      {isLoaderOpen ? (
        <FullPage_Loader />
      ) : (
        <div className="flex justify-between">
          <Navbar />
          <Left_Side_Bar />
          <Outlet />
          <Right_Side_Bar />
        </div>
      )}
    </>
  );
};

export default App;
