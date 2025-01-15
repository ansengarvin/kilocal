import styled from "@emotion/styled";
import { mobileView } from "../../lib/defines";

export const FoodEntryStyle = styled.div`
    width: 100%;
    height: min-content;

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
        background-color: #e3a4e3;
    }

    form.entryContainer {
        width: calc(95% - 3px);
        padding: 3px;
    }

    div.row {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 4px;
    }

    // Remove arrow buttons from number inputs across platforms
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type=number] {
      -webkit-appearance: textfield;
      -moz-appearance: textfield;
      appearance: textfield;
    }

    // Remove default styling from inputs
    input {
        all: unset;
    }

    .stat {
        height: 50px;
        border-radius: 10px;

        @media (max-width: ${mobileView}) {
            height: 40px;
        }
        
        display: flex;
        justify-content: center;
        align-items: center;
    }

    input.stat {
        // Add own styling
        background-color:white;
        text-align: center;
    }
    
    div.stat {
        background-color: #ffffff;
    }

    .header {
        height: 20px;
    }

    td.foodName, th.foodName {
        width: 100%;
    }

    label {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 3px;
    }

    label.foodName, input.foodName {
        flex-grow: 1;  
    }

    .calories {
        min-width: 75px;
        max-width: 75px;
    }

    .macro {
        min-width: 50px;
        max-width: 50px;
    }

    .buttonContainer {
        width: 35px;
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