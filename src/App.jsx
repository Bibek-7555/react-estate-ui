import "./components/Navbarfolder/Navbar"
import Navbar from "./components/Navbarfolder/Navbar"
import HomePage from "./routes/homePage/homePage"
import ListPage from "./routes/listpage/listPage";
import Register from "./routes/register/registerPage";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { Layout, RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/SinglePage/SinglePage";
import { Children } from "react"
import ProfilePage from "./routes/profilePage/profilePage";
import LoginPage from "./routes/Login/LoginPage";
import ProfilePageUpdate from "./routes/profilePageUpdate/profilePageUpdate";
import AddpostPage from "./routes/addPost/addpostPage";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders.js";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/list",
            element: <ListPage />,
            loader: listPageLoader
          },
          {
            path: "/:id",
            element: <SinglePage />,
            loader: singlePageLoader
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/register",
            element: <Register />,
          },
          
        ]
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader
        },
        {
          path: "profile-update",
          element: <ProfilePageUpdate />
        },
        {
          path: "add-post",
          element: <AddpostPage />
        }
      ]
    }
  ]);

  return (
    
    <RouterProvider router={router} />
  )
  }

export default App