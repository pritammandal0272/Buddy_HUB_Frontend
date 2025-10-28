import React from "react";
import { Navbar } from "../Components/AllOuterCoponents/Navbar";
import { Left_Side_Bar } from "../Components/AllOuterCoponents/Left_Side";
import { Outlet } from "react-router-dom";
export const Navbar_Outlet = () => {
    return <>
        <Navbar />
        <Left_Side_Bar />
        <Outlet />
    </>
}