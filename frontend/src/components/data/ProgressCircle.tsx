import styled from "@emotion/styled"

interface progressCircleProps {
    value: number
    goal: number
    radius: number
    strokeWidth: number
    fontSize: string
    textColor: string
    backColor: string
    color: string
}

interface circleDivProps {
    radius: number
}

const CircleDiv = styled.div<circleDivProps>`
    height: ${props => props.radius * 2}px;
    width: ${props => props.radius * 2}px;
`

export function ProgressCircle(props: progressCircleProps) {
    const {value, goal, radius, strokeWidth, fontSize, textColor, backColor, color} = props

    console.log(value, " ", goal)
    console.log(value/goal)

    const adjustedRadius = radius - strokeWidth/2

    // Path Flags
    const flipped = value / goal > 0.5 ? 0 : 1
    return (
        <>
            <CircleDiv
                radius={radius}
            >
                <svg viewBox={`0 0 ${radius*2} ${radius*2}`}>
                    <circle
                        cx={radius}
                        cy={radius}
                        r={adjustedRadius}
                        fill={"none"}
                        stroke={backColor}
                        strokeWidth={strokeWidth-1}
                    />
                    <circle
                        cx={radius}
                        cy={radius}
                        r={adjustedRadius}
                        fill={"none"}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${2*Math.PI*adjustedRadius*value/goal} ${2*Math.PI*adjustedRadius*(1-value/goal)}`}
                        strokeDashoffset={2*Math.PI*adjustedRadius*flipped}
                        strokeLinecap={"round"}
                        transform={`rotate(-90 ${radius} ${radius})`}
                    />
                    <text
                        x={radius}
                        y={radius}
                        fill={textColor}
                        textAnchor={"middle"}
                        alignmentBaseline={"middle"}
                        fontSize={fontSize}
                    >
                        {value}/{goal}
                    </text>
                </svg>
            </CircleDiv>
            
        </>
    )
}