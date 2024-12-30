import styled from "@emotion/styled"

interface pieChartProps {
    radius: number
    borderWidth: number
    borderColor: string
    sections: Array<number>
    colors: Array<string>
    textColor?: string
    hasText?: boolean
}


interface pieChartDivProps {
    dim: number
}
const PieChartDiv = styled.div<pieChartDivProps>`
    height: ${props => props.dim}px;
    width: ${props => props.dim}px;
`

export function PieChart(props: pieChartProps) {
    const {radius, borderWidth, borderColor, sections, colors, hasText, textColor} = props

    return (
        <PieChartDiv dim={radius*2}>
            <svg viewBox={`0 0 ${radius*2} ${radius*2}`}>
                {/* Draw square encompassing entire viewbox */}
                {sections.map((section, index) => {
                    return (
                        <circle
                            cx={radius}
                            cy={radius}
                            r={radius/2}
                            fill={"none"}
                            stroke={colors[index]}
                            strokeWidth={radius-borderWidth}
                            strokeDasharray={`${2*Math.PI*radius/2*section}, ${2*Math.PI*radius/2*(1-section)}`}
                            transform={`rotate(${360*sections.slice(0, index).reduce((a, b) => a + b, 0)} ${radius} ${radius})`}
                        />
                    )
                })}
                {sections.map((section, index) => {
                    const isOnLeftSide = (
                        360*sections.slice(0, index).reduce((a, b) => a + b, 0)+360*section/2 > 90 &&
                        360*sections.slice(0, index).reduce((a, b) => a + b, 0)+360*section/2 < 270
                    )
                    const isInMiddle = (
                        360*sections.slice(0, index).reduce((a, b) => a + b, 0)+360*section/2 > 45 &&
                        360*sections.slice(0, index).reduce((a, b) => a + b, 0)+360*section/2 < 135
                    )

                    let anchor = "middle"
                    if (!isInMiddle) {
                        if (isOnLeftSide && !isInMiddle) {
                            anchor = "end"
                        } else {
                            anchor = "start"
                        }
                    }
                    
                    return (
                        <>
                            {
                                hasText ?
                                <text
                                    x={radius}
                                    y={radius}
                                    fill={textColor}
                                    textAnchor={anchor}
                                    alignmentBaseline={"middle"}
                                    fontSize={"10pt"}
                                    transform={`
                                        rotate(${360*sections.slice(0, index).reduce((a, b) => a + b, 0)+360*section/2} ${radius} ${radius})
                                        translate(${radius/2} ${0})
                                        rotate(${(-360*(sections.slice(0, index).reduce((a, b) => a + b, 0)+section/2))} ${radius} ${radius})
                                    `}
                                >
                                    {section*100}%
                                </text> :
                                <></>
                            }
                            
                            <path
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                                d={`
                                    M ${radius} ${radius}
                                    L ${2*radius-borderWidth} ${radius}
                                `}
                                transform={`rotate(${360*sections.slice(0, index).reduce((a, b) => a + b, 0)} ${radius} ${radius})`}
                            />
                        </> 
                    )
                })}
                <circle
                    cx={radius}
                    cy={radius}
                    r={radius - borderWidth}
                    fill={"none"}
                    stroke={borderColor}
                    strokeWidth={borderWidth}
                />
            </svg>
        </PieChartDiv>
        
    )
}