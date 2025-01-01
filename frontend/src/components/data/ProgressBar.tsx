import styled from "@emotion/styled"

interface progressBarDivProps{
    barWidth: string
    barHeight: string
    progressWidth: string
    fontSize: string
}

const ProgressBarDiv = styled.div<progressBarDivProps>`
  height: ${props => props.barHeight};
  width: ${props => props.barWidth};
  position: relative;

  display: flex;
  gap: 10px;
  justify-content: center;

  font-size: ${props => props.fontSize};

  background-color: white;
  border-radius: 25px;
  
  .number {
    position: absolute;
    color: #343434;
  }

  .progressBar {
    width: ${props => props.progressWidth};
    height: inherit;
    background-color: #c3c3c3;
    border-radius: 25px;
    margin-right: auto;
  }
`

interface progressBarProps {
    value: number
    goal: number
    height: string
    width: string
    fontSize: string
}

export function ProgressBar(props: progressBarProps) {
    const {value, goal, height, width, fontSize} = props

    const progressWidth = (`${(value / 2000 * 100).toString()}%`)

    const labelText = `${value} out of 2000."`

    return (
        <ProgressBarDiv 
            barWidth =  {width}
            barHeight = {height}
            progressWidth = {progressWidth}
            fontSize={fontSize}
        >
            <div className="progressBar"/>
            <div className="number total" tabIndex={0} aria-label={labelText}>
                {value} / {goal}
            </div>
        </ProgressBarDiv>
    )
}