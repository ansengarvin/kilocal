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
    }

    div.buttonSection {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
    }

    button {
        margin: 0;
        padding: 0;
        border: none;
        background: none;
        font: inherit;
        height: 35px;
        border-radius: 10px;
        margin-bottom: 10px;
        background-color: black;
        color: white;
        width: 100%;
        background-color: #0ba100;
    }

    a {
        // Default blue link color
        color: #0073ff;
        text-decoration: none;
    }
`