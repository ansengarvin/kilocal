import styled from "@emotion/styled";
import { mobileView } from "../../lib/defines";

export const FoodEntryStyle = styled.div`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    table {
        background-color: green;
    }

    td {
        white-space: nowrap;
    }

    .entryContainer {
        width: 95%;
    }

    .stat {
        height: 50px;
        border-radius: 10px;
        
        display: flex;
        justify-content: center;
        align-items: center;
    }

    input.stat {
        background-color:white;
    }

    div.stat {
        background-color: #ffffff;
    }

    .header {
        height: 20px;
    }

    .entry {
        height: 50px;

        @media (max-width: ${mobileView}) {
            height: 40px;
        }
    }

    .foodName {
        width: 100%;
    }

    .calories {
        min-width: 75px;
    }

    .macro {
        min-width: 50px;
    }

    .buttonContainer {
        width: min-content;
        background-color: green;
    }

    button {
        height: 35px;
        width: 35px;
        border: none;
        border-radius: 50%;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    button.delete {
        background-color: #db3e3e;
        padding: 5px;
    }

    button.delete:hover {
        background-color: #ff5050;
    }

    button.edit {
        background-color: #474747;
        padding: 5px;
    }

    button.edit:hover {
        background-color: #626262;
    }
`