import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Router_Outlet from "./Router/Router_Outlet";
import BranchStoreContextProvider from "./BranchStore/BranchStore";
const router = createBrowserRouter(Router_Outlet);
createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <BranchStoreContextProvider>
      <RouterProvider router={router} />
    </BranchStoreContextProvider>
  // </StrictMode>
);
