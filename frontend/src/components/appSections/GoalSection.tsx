import styled from "@emotion/styled";
import { ProgressCircle } from "../data/ProgressCircle";
import { PieChartWithKey } from "../data/PieChartWithKey";
import { mobileViewPx } from "../../lib/defines";

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


// const carbColor = "#124E78"
// const proteinColor = "#8C271E"
// const fatColor = "#FFBA49"

const calorieColor = "#417B5A"
const carbColor = "#235789"
const proteinColor = "#C1292E"
const fatColor = "#ED9B40"

const largeMetricRadius = (screen.width > mobileViewPx ? 60 : 40);
const largeMetricFontSize = (screen.width > mobileViewPx ? "14pt" : "11pt");
const pieChartKeyFontSize = (screen.width > mobileViewPx ? "12pt" : "10pt");

const smallMetricRadius = (screen.width > mobileViewPx ? 50 : 30);
const smallMetricFontSize = (screen.width > mobileViewPx ? "12pt" : "10pt");

const GoalSectionDiv = styled.div`
    width: 100%;
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

const metricBackColor = "#cbcbcb"
const metricTextColor = "#383838"


export function GoalSection(props: GoalSectionProps) {
    const {
        calorieTotal,
        calorieGoal,
        carbTotal,
        carbGoal,
        proteinTotal,
        proteinGoal,
        fatTotal,
        fatGoal
    } = props

    const macroTotals = carbTotal + proteinTotal + fatTotal
    let carbPercentage = (carbTotal / macroTotals)
    let proteinPercentage = (proteinTotal / macroTotals)
    let fatPercentage = (fatTotal / macroTotals)
    if (macroTotals==0) {
        carbPercentage = 0.333
        proteinPercentage = 0.333
        fatPercentage = 0.333
    }
   

    return (
        <GoalSectionDiv className="appElement">
            <h2>
                Daily Goals
            </h2>
            <div className="subsection">
                <div className="metric">
                    <h3>
                        Calories
                    </h3>
                    <ProgressCircle
                        value={calorieTotal}
                        goal={calorieGoal}
                        strokeWidth={15}
                        radius={largeMetricRadius}
                        fontSize={largeMetricFontSize}
                        textColor={metricTextColor}
                        backColor={metricBackColor}
                        color={calorieColor}
                    />
                    <h3>Macros</h3>
                    <PieChartWithKey
                        radius={largeMetricRadius}
                        borderWidth={0}
                        borderColor={"#000000"}
                        sections={[carbPercentage, proteinPercentage, fatPercentage]}
                        colors={[carbColor, proteinColor, fatColor]}
                        titles={["Carbs", "Protein", "Fat"]}
                        textColor={metricTextColor}
                        ignoreKeyWidth={true}
                        fontSize={pieChartKeyFontSize}
                    />
                </div>
            </div>
            <div className="subsection">
                <div className="metric">
                    <h3>
                        Carbs
                    </h3>
                    <ProgressCircle
                        value={carbTotal}
                        goal={carbGoal}
                        strokeWidth={10}
                        radius={smallMetricRadius}
                        fontSize={smallMetricFontSize}
                        textColor={metricTextColor}
                        backColor={metricBackColor}
                        color={carbColor}
                    />   
                </div>
                <div className="metric">
                    <h3>
                        Protein
                    </h3>
                    <ProgressCircle
                        value={proteinTotal}
                        goal={proteinGoal}
                        strokeWidth={10}
                        radius={smallMetricRadius}
                        fontSize={smallMetricFontSize}
                        textColor={metricTextColor}
                        backColor={metricBackColor}
                        color={proteinColor}
                    /> 
                </div>
                <div className="metric">
                    <h3>
                        Fat
                    </h3>
                    <ProgressCircle
                        value={fatTotal}
                        goal={fatGoal}
                        strokeWidth={10}
                        radius={smallMetricRadius}
                        fontSize={smallMetricFontSize}
                        textColor={metricTextColor}
                        backColor={metricBackColor}
                        color={fatColor}
                    />  
                </div>
            </div>   
        </GoalSectionDiv>
    )
}
