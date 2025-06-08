import styled from "@emotion/styled";
import { appWindowColor, mobileView } from "../lib/defines";

export const LoginStyle = styled.div`
    height: min-content;
    width: 700px;

    @media (max-width: ${mobileView}) {
        width: 100%;
    }

    background-color: ${appWindowColor};
    padding-top: 10px;
    padding-bottom: 50px;
    margin-top: 50px;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    form {
        width: 80%;
    }

    input {
        margin: 0;
        padding: 0;
        border: none;
        background: none;
        font: inherit;
        color: inherit;
        cursor: text;
        outline: none;
        width: 100%;
        height: 50px;
        border-radius: 10px;
        border: 1px solid black;
        background-color: white;
        margin-bottom: 10px;
        // Set text margin
        padding-left: 10px;
        // Adjust width so padding doesnt make it wider
        box-sizing: border-box;
    }

    input.error {
        border: 1px solid red;
        background-color: #ffe4e4;
    }

    input:disabled {
        background-color: #f5f5f5;
        border-color: #7a7a7a;
        color: #7a7a7a;
        // Remove autofill color
        -webkit-text-fill-color: #7a7a7a;
        cursor: wait;
    }

    span.error {
        color: #c50000;
    }

    div.buttonSection {
        width: 100%;
        height: 35px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
        margin-bottom: 10px;
        gap: 5px;
    }

    button {
        margin: 0;
        padding: 0;
        border: none;
        background: none;
        font: inherit;
        height: 35px;
        border-radius: 10px;
        background-color: black;
        color: white;
        width: 100%;
        background-color: #1673b1;
    }

    button:hover {
        background-color: #258ace;
    }

    button.half {
        width: 45%;
    }

    button.grey {
        background-color: grey;

        :hover {
            background-color: #8c8c8c;
        }
    }

    button.loading {
        background-color: #41be38;
        color: black;
        transition:
            background-color 0.3s ease,
            color 0.3s ease;
    }

    h1 {
        margin-bottom: 20px;
    }
`;
