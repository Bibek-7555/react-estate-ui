import "./components/Navbarfolder/Navbar"
import Navbar from "./components/Navbarfolder/Navbar"
import HomePage from "./routes/homePage/homePage"
import ListPage from "./routes/listpage/listPage";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Layout from "./routes/layout/layout";
import SinglePage from "./routes/SinglePage/SinglePage";
import { Children } from "react"

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
            element: <ListPage />
          },
          {
            path: "/:id",
            element: <SinglePage />
          }
        ]
    }
  ]);

  return (
    
    <RouterProvider router={router} />
  )
  }

export default App