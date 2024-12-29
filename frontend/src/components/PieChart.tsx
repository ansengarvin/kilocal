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
                        strokeWidth={radius}
                        strokeDasharray={`${2*Math.PI*radius/2*section}, ${2*Math.PI*radius/2*(1-section)}`}
                        transform={`rotate(${360*sections.slice(0, index).reduce((a, b) => a + b, 0)} ${radius} ${radius})`}
                    />
                )
            })}
        </svg>
    )
}