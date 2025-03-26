// router.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/Layout/MainLayout";
import HomePage from "./pages/Home/Home";
import AboutPage from "./pages/About/About";
import RootWrapper from "./Layout/RootWrapper";

const mainLayoutRoutes = [
  {
    path: "/",
    index: true,
    element: <HomePage />,
  },
  {
    path: "/About",
    element: <AboutPage />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootWrapper />, 
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: mainLayoutRoutes,
      },
      //More routes can be added here
    ],
  },
]);

export default router;
