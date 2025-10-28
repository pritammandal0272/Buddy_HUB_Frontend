import React from "react";
const Day = [
  "Day",
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];
const Month = [
  "Month",
  "January",
  "Febuary",
  "Merch",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Septembar",
  "Octobar",
  "Novembar",
  "Decembar",
];
const Year = [
  "Year",
  1990,
  1991,
  1992,
  1993,
  1994,
  1995,
  1996,
  1997,
  1998,
  1999,
  2000,
  2001,
  2002,
  2003,
  2004,
  2005,
  2006,
  2007,
  2008,
  2009,
  2010,
  2011,
  2012,
  2013,
  2014,
  2015,
];
export const DOB = ({ SignUpInput, setSignUpInput }) => {
  const DateFunction = (e) => {
    const { name, value } = e.target;
    setSignUpInput((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <div className=" shrink-0 w-full items-center mr-9 h-it">
        <h1 className="text-lg p-0 m-0 font-semibold">Date of Birth</h1>
        <div className="flex justify-between">
          <div>
            <div className="flex">
              <label
                className="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                htmlFor="name"
              >
                Day
              </label>
            </div>
            <select
              name="day"
              id=""
              className="px-2 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
              onChange={(e) => DateFunction(e)}
            >
              {Day.map((item) => {
                return <option key={item} value={item}>{item}</option>;
              })}
            </select>
          </div>
          <div>
            <div className="flex">
              <label
                className="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                htmlFor="name"
              >
                Month
              </label>
            </div>
            <select
              name="month"
              id=""
              className="px-2 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
              onChange={(e) => DateFunction(e)}
            >
              {Month.map((item) => {
                return <option key={item} value={item}>{item}</option>;
              })}
            </select>
          </div>
          <div>
            <div className="flex">
              <label
                className="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
                htmlFor="name"
              >
                Year
              </label>
            </div>
            <select
              name="year"
              id=""
              className="px-2 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
              onChange={(e) => DateFunction(e)}
            >
              {Year.map((item) => {
                return <option key={item} value={item}>{item}</option>;
              })}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};
