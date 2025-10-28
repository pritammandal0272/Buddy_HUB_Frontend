import { Toaster } from "react-hot-toast";
import { ConnectionInner } from "../Inner_Components/ConnectionInner/ConnectionInner";
import { useEffect, useState } from "react";
export const Connections = () => {
  const [navbarShow, setnavbarShow] = useState(true);
  const [lastScrollY, setlastScrollY] = useState(0);
  useEffect(() => {
    const ScrollFunction = () => {
      let CurrentScroll = window.scrollY;
      if (CurrentScroll  > lastScrollY) {
        setnavbarShow(false);
      } else {
        setnavbarShow(true);
      }
      setlastScrollY(CurrentScroll);
    };
    window.addEventListener("scroll", ScrollFunction);
    return () => window.removeEventListener("scroll", ScrollFunction);
  },[lastScrollY]);
  return (
    <div className={`w-full h-fit bg-[#f0f2f5] ${navbarShow?"pt-[13vh]":"pt-0"} md:pt-[9vh] md:px-[17em] p-4`}>
      <Toaster />

      <ConnectionInner />
    </div>
  );
};
