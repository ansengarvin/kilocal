import { createBrowserRouter } from "react-router-dom";
import { Root } from "./components/global/Root";
import { Journal } from "./routes/Journal";
import { Login } from "./routes/Login";
import { Signup } from "./routes/Signup";
import Profile from "./routes/Profile";
import Verify from "./routes/Verify";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Root>404</Root>,
        children: [
            { index: true, element: <Journal /> },
            { path: "/profile", element: <Profile /> },
            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },
            { path: "/verify", element: <Verify /> },
        ],
    },
]);
