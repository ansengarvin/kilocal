import { css } from "@emotion/react";
import { AppTheme } from "./theme.tsx";

export const globalStyle = (theme: AppTheme) => css`
    html,
    body {
        margin: 0;
        font-family: "Roboto", sans-serif;
        background-color: #ffffff;

        color: #353535;
    }

    input {
        all: unset;
    }

    h1,
    h2,
    h3 {
        margin: 0;

        color: ${theme.colors.onSurface};
    }

    h1 {
        font-size: 2em;

        @media (max-width: ${theme.breakpoints.mobile}) {
            font-size: 1.5em;
        }
    }

    h2 {
        font-size: 1.5em;

        @media (max-width: ${theme.breakpoints.mobile}) {
            font-size: 1.25em;
        }
    }

    h3 {
        font-size: 1.25em;

        @media (max-width: ${theme.breakpoints.mobile}) {
            font-size: 1em;
        }
    }

    label,
    th {
        font-weight: normal;
        font-size: 1em;

        @media (max-width: ${theme.breakpoints.mobile}) {
            font-size: 0.75em;
        }
    }

    input,
    td {
    }

    span {
        font-size: 1em;

        @media (max-width: ${theme.breakpoints.mobile}) {
            font-size: 0.75em;
        }
        height: 1em;
    }

    .appWindow {
        background-color: ${theme.colors.surface};
    }

    a {
        // Default blue link color
        color: #0073ff;
        text-decoration: none;
    }

    button {
        transition: 0.5s;
    }
`;
