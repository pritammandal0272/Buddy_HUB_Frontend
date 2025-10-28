import React, { useEffect, useState } from "react";
export const StoryLine = ({ ChangeStatusInner }) => {
  const [Line, setLine] = useState(100);
  useEffect(() => {
    const StopInterval = setInterval(() => {
      setLine((prev) => {
        if (prev == 0) return 100;
        else return prev - 1;
      });
    }, 97);
    return () => clearInterval(StopInterval);
  }, []);
  useEffect(() => {
    setLine(100);
  }, [ChangeStatusInner]);
  return (
    <div className="w-full h-1 rounded-3xl overflow-hidden flex">
      <div
        className="bg-blue-500 h-full transition-all ease-linear"
        style={{ width: `${Line}%` }}
      ></div>
    </div>
  );
};
