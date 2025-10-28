import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Backend_Path } from "../Inner_Components/LogInPage/Backend_Path";
import { motion, AnimatePresence } from "framer-motion";
import { EmailChange } from "../Inner_Components/SettingsComponents/EmailChange";
import { Loader } from "../Loader/Loader";
import { ChangePassword } from "../Inner_Components/SettingsComponents/ChangePassword";
export const Settings = () => {
  const [User_information, setUser_information] = useState([]);
  const [isLoaderOpen, setisLoaderOpen] = useState(false);
  const [OpenSettengsBar, setOpenSettengsBar] = useState("account");
  useEffect(() => {
    const Fetch_Function = async () => {
      setisLoaderOpen(true);
      const Local_Storage_id = localStorage.getItem("id");
      if (localStorage.getItem("id") != null) {
        try {
          const Fetch_User_Information = await fetch(
            `${Backend_Path()}/home/find-logindata${localStorage.getItem("id")}`
          );
          const Response_Data = await Fetch_User_Information.json();
          setUser_information(Response_Data);
          setisLoaderOpen(false);
        } catch (error) {
          console.log(error);
          setUser_information([]);
          setisLoaderOpen(false);
          toast.error("Server Error");
        }
      }
    };
    Fetch_Function();
  }, []);
  const navigate = useNavigate();
  const LogoutFunction = () => {
    const LocalRemoveData = localStorage.removeItem("id");
    sessionStorage.removeItem("loading");
    navigate("/");
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <>
      <div className=" w-full h-[100vh] pt-[12vh]  md:pt-[8vh] md:pl-[17em] md:pr-[3em]">
        <Loader isLoaderOpen={isLoaderOpen} />
        <Toaster />
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div class="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto  mt-2">
              <h1 class="border-b py-6 text-4xl font-semibold ml-2">
                Settings
              </h1>
              <div class="grid grid-cols-8 pt-3 sm:grid-cols-10">
                <div class="col-span-2">
                  <ul>
                    <li
                      class={`mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700 ${
                        OpenSettengsBar == "features"
                          ? "border-l-blue-700 text-blue-700"
                          : "border-none"
                      }`}
                      onClick={() => setOpenSettengsBar("features")}
                    >
                      Features
                    </li>
                    <li
                      class={`mt-5 transition-all duration-300 ease-in-out cursor-pointer border-l-2 border-l-blue-700 px-2 py-2 font-semibold hover:border-l-blue-700 hover:text-blue-700 ${
                        OpenSettengsBar == "account"
                          ? "border-l-blue-700 text-blue-700"
                          : "border-none"
                      }`}
                      onClick={() => setOpenSettengsBar("account")}
                    >
                      Accounts
                    </li>
                  </ul>
                </div>

                <div class="col-span-8 mb-8 transition-all duration-500 ease-in-out overflow-hidden px-2 rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
                  <div
                    className={`max-w-6xl mx-auto p-6 space-y-12 ${
                      OpenSettengsBar == "features"
                        ? "opacity-100 pointer-events-auto h-fit"
                        : "opacity-0 pointer-events-none h-0 w-0"
                    }`}
                  >
                    <h1 className="text-4xl font-bold text-gray-800 border-b pb-3">
                      Features
                    </h1>
                    <div className={`flex flex-wrap gap-10 `}>
                      <section className="flex-1 min-w-[280px]">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Profile
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                          <li>Edit Profile Information</li>
                          <li>Profile Details Section</li>
                          <li>Post Timeline</li>
                          <li>Friends List</li>
                          <li>Photos Section etc.</li>
                        </ul>
                      </section>

                      {/* Security Section */}
                      <section className="flex-1 min-w-[280px]">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Security
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                          <li>Change Password</li>
                          <li>Email Change With OTP</li>
                          <li>Google Authenticator etc.</li>
                        </ul>
                      </section>

                      {/* Privacy Section */}
                      <section className="flex-1 min-w-[280px]">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Messenger
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                          <li>Real-Time Messaging</li>
                          <li>Seen/Delivered Status</li>
                          <li>Online/Offline Status etc.</li>
                        </ul>
                      </section>

                      {/* Notifications Section */}
                      <section className="flex-1 min-w-[280px]">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Notifications
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                          <li>Email Notifications</li>
                          <li>Friend Request Notification</li>
                          <li>Message Received Notification</li>
                          <li>Highlight unread notifications etc.</li>
                        </ul>
                      </section>

                      {/* Story Feature */}
                      <section className="flex-1 min-w-[280px]">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Story Features
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                          <li>Upload Stories Photo or text-based stories.</li>
                          <li>Progress Bar</li>
                          <li>Tap to Next / Previous etc</li>
                        </ul>
                      </section>

                      {/* Language & Region */}
                      <section className="flex-1 min-w-[280px]">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Language & Region
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                          <li>Preferred Language</li>
                          <li>Timezone Settings</li>
                        </ul>
                      </section>

                      {/* Home Feed – Random Posts */}
                      <section className="flex-1 min-w-[280px]">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Home Feed – Random Posts
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                          <li>Random Post Loading</li>
                          <li>Like / Comment / Share Section</li>
                          <li>Engagement etc.</li>
                        </ul>
                      </section>
                      {/*Latest News */}
                      <section className="flex-1 min-w-[280px]">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Latest News
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                          <li>Real-Time News Feed</li>
                          <li>Trending Headlines</li>
                          <li>Multimedia News Support etc.</li>
                        </ul>
                      </section>
                      {/*Connections */}
                      <section className="flex-1 min-w-[280px]">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Connections
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                          <li>Send / Accept / Cancle Connection Requests</li>
                          <li>Mutual Connectionss</li>
                          <li>Connection Status</li>
                          <li>Remove / Unfriend etc.</li>
                        </ul>
                      </section>

                      {/* Danger Zone */}
                      <section className="flex-1 min-w-[280px]">
                        <h2 className="text-2xl font-semibold text-red-600 mb-4">
                          Danger Zone
                        </h2>
                        <ul className="space-y-3 text-red-500">
                          <li>Deactivate Account</li>
                          <li>Delete Account Permanently</li>
                        </ul>
                      </section>
                    </div>
                  </div>
                  {/* =================Setiengs Account Part============ */}
                  <div
                    className={`${
                      OpenSettengsBar == "account"
                        ? "opacity-100 pointer-events-auto h-fit"
                        : "opacity-0 pointer-events-none h-0 w-0"
                    }`}
                  >
                    <div class="pt-0">
                      <h1 class="py-2 text-2xl font-semibold">
                        Account settings
                      </h1>
                      <p class="font- text-slate-600">
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit.
                      </p>
                    </div>
                    <hr class="mt-4 mb-8" />
                    <p class="py-2 text-xl font-semibold">Email Address</p>
                    <EmailChange
                      User_information={User_information}
                      setUser_information={setUser_information}
                    />
                    <hr class="mt-4 mb-8" />
                    <ChangePassword
                      User_information={User_information}
                      setUser_information={setUser_information}
                    />
                    <hr class="mt-4 mb-8" />

                    <div class="mb-10">
                      <p class="py-2 text-xl font-semibold">Delete Account</p>
                      <p class="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="mr-2 h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        Proceed with caution
                      </p>
                      <p class="mt-2">
                        Make sure you have taken backup of your account in case
                        you ever need to get access to your data. We will
                        completely wipe your data. There is no way to access
                        your account after this action.
                      </p>
                      <button class="ml-auto text-sm font-semibold text-rose-600 underline decoration-2">
                        Continue with deletion
                      </button>
                    </div>
                    <div className="w-full h-fit flex items-center justify-end">
                      <button
                        class="mb-4 rounded-lg bg-red-500 px-4 py-2 text-white"
                        onClick={() => {
                          return LogoutFunction();
                        }}
                      >
                        LogOut
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
