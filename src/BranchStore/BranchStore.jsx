import React, { createContext, useEffect, useRef, useState } from "react";
import { Story } from "../AllData";
import { Backend_Path } from "../Backend_Path";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
export const BranchStoreApi = createContext();
const StoryData = Story();
const BranchStoreContextProvider = ({ children }) => {
  const [User_information, setUser_information] = useState([]);
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const [LoaderState, setLoaderState] = useState(false);
  const [re_RenderState, setre_RenderState] = useState(1);
  useEffect(() => {
    const Fetch_Function = async () => {
      console.log("dd");

      setisLoaderOpen(true);
      const Local_Storage_id = localStorage.getItem("id");
      if (Local_Storage_id != null) {
        try {
          const [Fetch_User_Information, Fetch_User_Friends, Fetch_User_Posts] =
            await Promise.all([
              fetch(
                `${Backend_Path()}/home/find-user-information${Local_Storage_id}`
              ).then((res) => res.json()),
              fetch(
                `${Backend_Path()}/home/find-user-friends${Local_Storage_id}`
              ).then((res) => res.json()),
              fetch(
                `${Backend_Path()}/home/find-user-posts${Local_Storage_id}`
              ).then((res) => res.json()),
            ]);
          let AllData = [];
          AllData = [...AllData, Fetch_User_Information];
          AllData = [...AllData, Fetch_User_Friends];
          AllData = [...AllData, Fetch_User_Posts];
          setUser_information(AllData);
          setisLoaderOpen(false);
        } catch (error) {
          console.log(error);
          setUser_information([]);

          toast.error("Server Error");
        }
      }
    };
    Fetch_Function();
  }, [re_RenderState]);
  return (
    <BranchStoreApi.Provider
      value={{
        StoryData,
        User_information,
        setUser_information,
        isLoaderOpen,
        setisLoaderOpen,
        LoaderState,
        setre_RenderState,
        re_RenderState,
      }}
    >
      {/* <Toaster /> */}
      {children}
    </BranchStoreApi.Provider>
  );
};
export default BranchStoreContextProvider;
