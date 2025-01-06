import styled from "@emotion/styled";

export const LoginStyle = styled.div`
    height: 500px;
    width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #cdcdcd;
    padding-top: 50px;
    margin-top: 50px;
    border-radius: 10px;

    form {
        width: 50%;
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
    }

    label {
        // Add custom styling for label if needed
    }

    button {
        margin: 0;
        padding: 0;
        border: none;
        background: none;
        font: inherit;
        width: 50%;
        height: 45px;
        background-color: #5e99e1;
        border-radius: 10px;
        color: white;
    }
`