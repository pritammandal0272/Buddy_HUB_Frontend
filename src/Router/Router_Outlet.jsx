import App from "./App";
import { Feed } from "../Components/AllOuterCoponents/Feed";
import { Groups } from "../Components/AllOuterCoponents/Groups";
import { Notifications } from "../Components/AllOuterCoponents/Notifications";
import { Settings } from "../Components/AllOuterCoponents/Settings";
import { Viewprofile } from "../Components/AllOuterCoponents/Viewprofile";
import { Connections } from "../Components/AllOuterCoponents/Connections";
import { Latestnews } from "../Components/AllOuterCoponents/Latestnews";
import { Messenger } from "../Components/AllOuterCoponents/Messenger";
import { Navbar_Outlet } from "./Navbar_&_LeftSidebar";
import { StorySeen } from "../Components/AllOuterCoponents/StorySeen";
import { LogInPage } from "../Components/AllOuterCoponents/LoginPage";
import { View_Other_Profile } from "../Components/AllOuterCoponents/View_Other_Profile";
import { See_all_Friends } from "../Components/AllOuterCoponents/See_all_Friends";
const ArrayObj = [
  {
    path: "/",
    element: <LogInPage />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/feed",
        element: <Feed />,
      },
      {
        path: "/groups",
        element: <Groups />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/connections",
        element: <Connections />,
      },
      {
        path: "/latestnews",
        element: <Latestnews />,
      },
      {
        path: "/view-profile",
        element: <Viewprofile />,
      },
      {
        path: "/view-other-profile",
        element: <View_Other_Profile />,
      },
      {
        path: "/see-all-friends",
        element: <See_all_Friends />,
      },
    ],
  },
  {
    path: "/",
    element: <Navbar_Outlet />,
    children: [
      {
        path: "/messenger",
        element: <Messenger />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/story-seen",
        element: <StorySeen />,
      },
    ],
  },
];
export default ArrayObj;
