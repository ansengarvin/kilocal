import styled from "@emotion/styled";

interface LoginStyleProps {
    width: string
}

export const LoginStyle = styled.div<LoginStyleProps>`
    height: min-content;
    width: ${props => props.width};
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #cdcdcd;
    padding-top: 50px;
    padding-bottom: 50px;
    margin-top: 50px;
    border-radius: 10px;

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

    input.error{
        border: 1px solid red;
        background-color: #ffe4e4;
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
        background-color: #0ba100;
    }

    button:hover {
        background-color: #0cb900;
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
        transition: background-color 0.3s ease, color 0.3s ease;
    }
`