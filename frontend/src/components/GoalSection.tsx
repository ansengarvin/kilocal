import styled from "@emotion/styled";
import { ProgressCircle } from "./ProgressCircle";

interface GoalSectionProps {
    calorieTotal: number,
    calorieGoal: number,
}

const GoalSectionDiv = styled.div`
    background-color: #adadad;
    width: 90%;
    height: 200px;
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
            <ProgressCircle
                value={calorieTotal}
                goal={calorieGoal}
                strokeWidth={15}
                radius={60}
                fontSize="14pt"
                color={"#777777"}
            />
        </GoalSectionDiv>
    )
}
