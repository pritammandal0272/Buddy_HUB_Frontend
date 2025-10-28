import React from "react";
export const Messenger_Home_Page = () => {
  return (
    <>
      <div class="flex-1 flex flex-col rounded-lg h-full relative overflow-hidden">
        {/* <!-- Chat Area --> */}
        <div class="h-full bg-[#75caff50] rounded-lg shadow-xl flex flex-col items-center justify-center">
          <h1 className="text-4xl font-semibold text-purple-500">Welcome There!!</h1>
          <p>Now select your friend and Start your Conversation.</p>
        </div>
      </div>
    </>
  );
};
