import React, { useEffect, useState } from "react";
import Cover_Image from "../../assets/Images/cover_image.webp";
import { Loader } from "../Loader/Loader";
import { Backend_Path } from "../../Backend_Path";
import { motion, AnimatePresence } from "framer-motion";

// =================Api Data Fetch==============
export const Latestnews = () => {
  const [isLoaderOpen, setisLoader] = useState(false);
  const [NewsData, setNewsData] = useState([]);
  useEffect(() => {
    const NewsApiFunction = async () => {
      setisLoader(true);
      try {
        const DataFetch = await fetch(`${Backend_Path()}/news`);
        const Response = await DataFetch.json();
        setNewsData(Response.articles);
        setisLoader(false);
        // console.log(Response);
      } catch (err) {
        console.log(err);
        setisLoader(false);
      }
    };
    NewsApiFunction();
  }, []);
  return (
    <>
      <div className=" w-full h-fit  pt-[14vh] md:pt-[9vh] md:px-[17em] p-2 flex flex-col gap-3 relative">
        <Loader isLoaderOpen={isLoaderOpen} />
        {NewsData?.length == 0 || NewsData == undefined ? (
          !isLoaderOpen ? (
            <p className="text-center mt-2 text-gray-400">No Record Found</p>
          ) : null
        ) : (
          NewsData?.map((items, index) => {
            return (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div
                    key={index}
                    class="relative flex md:flex-row flex-col gap-2 bg-white rounded-md p-2 shadow-md"
                  >
                    <img
                      src={items.urlToImage}
                      alt=""
                      class="shadow-md rounded-lg bg-slate-50 md:w-[17rem]"
                      width="1216"
                      height="640"
                    />
                    <div class="">
                      <h3 class="mb-1 text-slate-900 font-semibold">
                        <span class="mb-1 block text-sm leading-6 text-indigo-500">
                          {items.author}
                        </span>
                        {items.title}
                      </h3>
                      <div class="text-slate-600">
                        <p>{items.description}</p>
                      </div>
                      <a
                        class="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 mt-6"
                        href={items.url}
                      >
                        Learn more
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            );
          })
        )}
      </div>
    </>
  );
};
