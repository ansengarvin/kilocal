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

    div.metric {
        margin-top: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h3 {
            color: #2a2a2a;
            margin: 0;
            margin-top: 5px;
            font-weight: normal;
        }
    }
`


export function GoalSection(props: GoalSectionProps) {
    const {calorieTotal, calorieGoal} = props
    return (
        <GoalSectionDiv>
            <div className="metric">
                <ProgressCircle
                    value={calorieTotal}
                    goal={calorieGoal}
                    strokeWidth={15}
                    radius={60}
                    fontSize="14pt"
                    color={"#777777"}
                />
                <h3>
                    Calories
                </h3>
                
            </div>
            
        </GoalSectionDiv>
    )
}
