import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Global } from "@emotion/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { globalStyle } from "./styles/global.ts";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Global styles={globalStyle} />
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>,
);
