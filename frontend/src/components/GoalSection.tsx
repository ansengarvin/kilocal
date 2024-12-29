import styled from "@emotion/styled";
import { ProgressCircle } from "./ProgressCircle";

interface GoalSectionProps {
    calorieTotal: number,
    calorieGoal: number,
    carbTotal: number,
    carbGoal: number,
    proteinTotal: number,
    proteinGoal: number,
    fatTotal: number,
    fatGoal: number
}

const GoalSectionDiv = styled.div`
    background-color: #adadad;
    width: 90%;
    height: min-content;
    margin-bottom: 10px;
    border-radius: 10px;

    padding-top: 10px;
    padding-bottom: 10px;

    display: flex;
    flex-direction: column;
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

    div.subsection {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 20px;
    }
`


export function GoalSection(props: GoalSectionProps) {
    const {calorieTotal, calorieGoal} = props
    return (
        <GoalSectionDiv>
            <div className="subsection">
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
            </div>
            <div className="subsection">
                <div className="metric">
                    <ProgressCircle
                        value={props.carbTotal}
                        goal={props.carbGoal}
                        strokeWidth={10}
                        radius={40}
                        fontSize="12pt"
                        color={"#777777"}
                    />
                    <h3>
                        Carbs
                    </h3>
                </div>
                <div className="metric">
                    <ProgressCircle
                        value={props.proteinTotal}
                        goal={props.proteinGoal}
                        strokeWidth={10}
                        radius={40}
                        fontSize="12pt"
                        color={"#777777"}
                    />
                    <h3>
                        Protein
                    </h3>
                </div>
                <div className="metric">
                    <ProgressCircle
                        value={props.fatTotal}
                        goal={props.fatGoal}
                        strokeWidth={10}
                        radius={40}
                        fontSize="12pt"
                        color={"#777777"}
                    />
                    <h3>
                        Fat
                    </h3>
                </div>
            </div>
            
        </GoalSectionDiv>
    )
}
