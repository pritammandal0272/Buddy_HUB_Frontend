import React, { useContext, useEffect, useState } from "react";
import { Messenger_Right_Side_Bar } from "../Inner_Components/Messenger/Messenger_Right_SideBar";
import { Messenger_Content } from "../Inner_Components/Messenger/Messenger_Content";
import { Messenger_Home_Page } from "../Inner_Components/Messenger/Messenger_Home_Page";
import Messenger_Store from "../../Messenger_Store/Messenger_Store";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const Messenger = () => {
  const [RouteData, setRouteData] = useState();
  const location_Data = useLocation();
  useEffect(() => {
    setRouteData(location_Data);
  }, []);
  return (
    <>
      <div className=" w-full h-[87vh] fixed pt-[13vh] md:pt-[8vh] md:pl-[17em]">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
        <div class="flex h-[88vh] mt-2 overflow-hidden md:gap-4 rounded-lg">
              <Messenger_Store>
                <Messenger_Content RouteData={RouteData} />
                <Messenger_Right_Side_Bar />
              </Messenger_Store>
        </div>
            </motion.div>
          </AnimatePresence>
      </div>
    </>
  );
};
