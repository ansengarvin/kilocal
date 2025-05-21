import styled from "@emotion/styled";
import { Fragment } from "react/jsx-runtime";

interface pieChartProps {
    radius: number;
    borderWidth: number;
    borderColor: string;
    sections: Array<number>;
    colors: Array<string>;
    textColor?: string;
    hasText?: boolean;
}

interface pieChartDivProps {
    dim: number;
}
const PieChartDiv = styled.div<pieChartDivProps>`
    height: ${(props) => props.dim}px;
    width: ${(props) => props.dim}px;
`;

export function PieChart(props: pieChartProps) {
    const { radius, borderWidth, borderColor, sections, colors } = props;

    return (
        <PieChartDiv dim={radius * 2}>
            <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
                {/* Draw square encompassing entire viewbox */}
                {sections.map((section, index) => {
                    // Setting r as such prevents there from being an ugly hole in the middle when a section is 100% of the chart.
                    const r = section * 100 == 100 ? (radius - borderWidth) / 2 : radius / 2;
                    return (
                        <circle
                            key={index}
                            cx={radius}
                            cy={radius}
                            r={r}
                            fill={"none"}
                            stroke={colors[index]}
                            strokeWidth={radius - borderWidth}
                            strokeDasharray={`${((2 * Math.PI * radius) / 2) * section}, ${((2 * Math.PI * radius) / 2) * (1 - section)}`}
                            transform={`rotate(${360 * sections.slice(0, index).reduce((a, b) => a + b, 0)} ${radius} ${radius})`}
                        />
                    );
                })}
                {sections.map((section, index) => {
                    return (
                        <Fragment key={index}>
                            {section * 100 != 0 && section * 100 != 100 && (
                                <path
                                    stroke={borderColor}
                                    strokeWidth={borderWidth}
                                    d={`
                                        M ${radius} ${radius}
                                        L ${2 * radius - borderWidth} ${radius}
                                    `}
                                    transform={`rotate(${360 * sections.slice(0, index).reduce((a, b) => a + b, 0)} ${radius} ${radius})`}
                                />
                            )}
                        </Fragment>
                    );
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
    );
}
