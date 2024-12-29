import styled from "@emotion/styled";
import { ProgressBar } from "./ProgressBar";

interface GoalSectionProps {
    calorieTotal: number,
    calorieGoal: number,
}



const GoalSectionDiv = styled.div`
    background-color: #adadad;
    width: 90%;
    height: 100px;
    margin-bottom: 10px;
    border-radius: 10px;

    display: flex;
    justify-content: center;
    align-items: center;
`


export function GoalSection(props: GoalSectionProps) {
    const {calorieTotal, calorieGoal} = props
    return (
        <GoalSectionDiv>
            <ProgressBar
                value={calorieTotal}
                goal={calorieGoal}
                height="30px"
                width="90%"
                fontSize="24px"
            />
        </GoalSectionDiv>
    )
}
