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
    ignoreKeyWidth?: boolean
    fontSize: string
}

interface chartDivProps {
    height: number
    color: string
    keyWidth: string
    fontSize: string
}

const ChartDiv = styled.div<chartDivProps>`
    display: flex;
    height: ${props => props.height}px;
    color: ${props => props.color};
    width: min-content;

    div.keys {
        height: 100%;
        width: ${props => props.keyWidth};

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

    p {
        margin: 0;
        padding: 0;
        white-space: nowrap;
        font-size: ${props => props.fontSize};
    }
`

export function PieChartWithKey(props: pieChartWithKeyProps) {
    const {
        radius, borderWidth, borderColor,
        sections, colors, titles, textColor,
        ignoreKeyWidth, fontSize
    } = props
    return (
        <ChartDiv
            height={radius*2}
            color={textColor}
            keyWidth={ignoreKeyWidth ? '0' : 'min-content'}
            fontSize={fontSize}
        >
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
                            <div  key={index}>
                                <div className="item">
                                    <svg height="20" width="20">
                                        <circle cx="10" cy="10" r="5" fill={colors[index]} />
                                    </svg>
                                    <p>
                                        {(sections[index] * 100).toFixed(0)}% {title}
                                    </p>    
                                </div>
                            </div>
                        )
                    })}
                </ul>
            </div>
        </ChartDiv>
    )
}