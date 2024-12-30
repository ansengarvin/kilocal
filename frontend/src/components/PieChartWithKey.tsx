import styled from "@emotion/styled"
import { PieChart } from "./PieChart"

interface pieChartWithKeyProps {
    radius: number
    borderWidth: number
    borderColor: string
    sections: Array<number>
    colors: Array<string>
    titles: Array<string>
    textColor: string
}

interface chartDivProps {
    height: number
    color: string
}

const ChartDiv = styled.div<chartDivProps>`
    display: flex;
    color: ${props => props.color};
    width: min-content;

    div.keys {
        height: 100%;
        width: min-content;

        display: flex;
        align-items: center;
    }

    div.item {
        display: flex;
        flex-direction: row;
    }

    ul {
        padding-left: 0
    }
`

export function PieChartWithKey(props: pieChartWithKeyProps) {
    const {radius, borderWidth, borderColor, sections, colors, titles, textColor} = props
    return (
        <ChartDiv height={radius} color={textColor}>
            <PieChart
                radius={radius}
                borderWidth={borderWidth}
                borderColor={borderColor}
                sections={sections}
                colors={colors}
            />
            <div className="keys">
                <ul>
                    {titles.map((title, index) => {
                        return (
                            <div>
                                <div className="item">
                                    <svg height="20" width="20">
                                        <circle cx="10" cy="10" r="5" fill={colors[index]} />
                                    </svg>
                                    {title}
                                </div>
                            </div>
                        )
                    })}
                </ul>
                
            </div>
        </ChartDiv>
    )
}