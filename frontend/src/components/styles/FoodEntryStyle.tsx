import styled from "@emotion/styled";
import { mobileView } from "../../lib/defines";

export const FoodEntryStyle = styled.div`
    width: 100%;
    height: min-content;

    display: flex;
    flex-direction: column;
    align-items: center;

    table {
    }

    td {
        white-space: nowrap;
    }

    form.entryContainer {
        width: calc(98% - 3px);
        padding: 3px;
    }

    table.entryContainer {
        width: 98%;
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
    input[type="number"] {
        -webkit-appearance: textfield;
        -moz-appearance: textfield;
        appearance: textfield;
    }

    // Remove default styling from inputs
    input {
        width: 0;
        min-width: 0;
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
        background-color: white;
        text-align: center;
        outline: solid 1px #dbd8cc;
    }

    div.stat {
        background-color: #dbd8cc;
    }

    .header {
        height: 20px;
    }

    td.foodName,
    th.foodName {
        width: 100%;
    }

    label {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 3px;
    }

    label.foodName,
    input.foodName {
        flex-grow: 1;
        flex-shrink: 1;
    }

    .calories {
        min-width: 75px;
        max-width: 75px;

        @media (max-width: ${mobileView}) {
            min-width: 40px;
            max-width: 40px;
        }
    }

    .macro {
        min-width: 75px;
        max-width: 75px;

        @media (max-width: ${mobileView}) {
            min-width: 40px;
            max-width: 40px;
        }
    }

    .buttonContainer {
        width: 35px;
        @media (max-width: ${mobileView}) {
            width: 25px;
        }
    }

    button {
        height: 35px;
        width: 35px;

        @media (max-width: ${mobileView}) {
            height: 25px;
            width: 25px;
        }

        border: none;
        border-radius: 50%;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button.submit {
        background-color: #37bc37;
    }

    button.submit:hover {
        background-color: #43d043;
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
`;
