import styled from "@emotion/styled"

interface progressBarDivProps{
    barWidth: string
    barHeight: string
    progressWidth: string
    fontSize?: string
}

const ProgressBarDiv = styled.div<progressBarDivProps>`
  height: ${props => props.barHeight};
  width: ${props => props.barWidth};

  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;

  font-size: ${props => props.fontSize || '1rem'};

  background-color: #737373;
  border-radius: 25px;
  
  .number {
    position: absolute;
    color: #dbdbdb;
  }

  .progressBar {
    width: ${props => props.progressWidth};
    height: inherit;
    background-color: #03af00;
    border-radius: 25px;
    margin-right: auto;
  }

  :hover{
    cursor: wait;
  }
`

interface progressBarProps {
    value: number
    goal: number
    height: string
    width: string
    fontSize?: string
    text?: string
}

export function ProgressBarNumber(props: progressBarProps) {
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

export function ProgressBarText(props: progressBarProps) {
    const {value, goal, height, width, fontSize, text} = props

    const progressWidth = (`${(value / goal * 100).toString()}%`)

    return (
        <ProgressBarDiv 
            barWidth =  {width}
            barHeight = {height}
            progressWidth = {progressWidth}
            fontSize={fontSize}
        >
            <div className="progressBar"/>
            <div className="number total" tabIndex={0} aria-label={text}>
                {text}
            </div>
        </ProgressBarDiv>
    )
}