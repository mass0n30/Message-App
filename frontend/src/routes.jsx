import App from "./App"; 
import Home from "./pages/Home"; 
import ErrorPage from "./components/ErrorPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import { ProfileView } from "./pages/Profile";
import ChatDirect from "./components/ChatDirect";

const routes = [
  {
    path: "/", 
    element: <App />, 
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // default render
        element:<Login/>,         
      },
      {
        path: "sign-up",
        element: <Signup />,
      },
      {
        path: "home",
        element: <Home />,
        children: [
          {
            index: true,
            element: <HomePage/> 
          },
          {
            path: ":roomId",
            element: <HomePage/>
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "profile/:userId",
            element: <ProfileView />
          },
          {
            path: "direct/:userId",
            element: <ChatDirect />
          }
        ],

      },
    ]
  },

];

export default routes;