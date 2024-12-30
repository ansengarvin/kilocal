import styled from "@emotion/styled"
import { PieChart } from "./PieChart"

interface pieChartWithKeyProps {
    radius: number
    borderWidth: number
    borderColor: string
    sections: Array<number>
    colors: Array<string>
    titles: Array<string>
}

interface chartDivProps {
    height: number
}

const ChartDiv = styled.div<chartDivProps>`
    height: ${props => props.height}px;

    display: flex;

    div.keys {
        height: 100%;
        width: min-content;
        
    }
`

export function PieChartWithKey(props: pieChartWithKeyProps) {
    const {radius, borderWidth, borderColor, sections, colors, titles} = props
    return (
        <ChartDiv height={radius}>
            
            <div className="keys">

            </div>
        </ChartDiv>
    )
}