import React from "react";
export const Name = ({ SignUpInput, setSignUpInput }) => {
  const InputBoxValueFunction = (e) => {
    const { name, value } = e.target;
    setSignUpInput((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <div className=" shrink-0 w-full mr-9 h-fit">
        <div className="w-full h-fit">
          <div className="flex">
            <label
              className="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
              htmlFor="name"
            >
              First Name
            </label>
          </div>
          <input
            id="name"
            name="firstname"
            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
            type="text"
            placeholder="Enter First Name here"
            value={SignUpInput.firstname}
            onChange={(e) => InputBoxValueFunction(e)}
          />
        </div>
        <div>
          <div className="flex">
            <label
              className="block mb-2 text-sm font-medium  bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent"
              // htmlFor="name"
            >
              Last Name
            </label>
          </div>
          <input
            // id="name"
            name="lastname"
            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm"
            type="text"
            placeholder="Your Last Name here"
            value={SignUpInput.lastname}
            onChange={(e) => InputBoxValueFunction(e)}
          />
        </div>
      </div>
    </>
  );
};
