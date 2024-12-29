interface pieChartProps {
    radius: number
    sections: Array<number>
    colors: Array<string>
}

export function PieChart(props: pieChartProps) {
    const {radius, sections, colors} = props
    return (
        <svg viewBox={`0 0 ${radius*2} ${radius*2}`}>
            {sections.map((section, index) => {
                return (
                    <circle
                    cx={radius}
                    cy={radius}
                    r={radius/2}
                    fill={"none"}
                    stroke={colors[index]}
                    strokeWidth={radius-2}
                    strokeDasharray={`${2*Math.PI*radius/2*section}, ${2*Math.PI*radius/2*(1-section)}`}
                    transform={`rotate(${360*sections.slice(0, index).reduce((a, b) => a + b, 0)} ${radius} ${radius})`}
                    />
                )
            })}
            {sections.map((section, index) => {
                return (
                    <>
                        <text
                            x={radius}
                            y={radius}
                            fill={"#000000"}
                            textAnchor={"middle"}
                            alignmentBaseline={"middle"}
                            fontSize={"10pt"}
                            transform={`
                                rotate(${360*sections.slice(0, index).reduce((a, b) => a + b, 0)+360*section/2} ${radius} ${radius})
                                translate(${radius/1.8} ${0})
                                rotate(${(-360*(sections.slice(0, index).reduce((a, b) => a + b, 0)+section/2))} ${radius} ${radius})
                            `}
                        >
                            {section}
                        </text>
                        <path
                            stroke={"#000000"}
                            strokeWidth={2}
                            d={`
                                M ${radius} ${radius}
                                L ${2*radius-2} ${radius}
                            `}
                            transform={`rotate(${360*sections.slice(0, index).reduce((a, b) => a + b, 0)} ${radius} ${radius})`}
                        />
                    </>
                    
                )
            })}
            <circle
                cx={radius}
                cy={radius}
                r={radius - 2}
                fill={"none"}
                stroke={"#000000"}
                strokeWidth={2}
            />
        </svg>
    )
}