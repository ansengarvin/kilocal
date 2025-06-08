import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Global, ThemeProvider } from "@emotion/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { globalStyle } from "./styles/global.ts";
import { theme } from "./styles/theme.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <Global styles={globalStyle} />
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </ThemeProvider>
    </StrictMode>,
);
