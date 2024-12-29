import styled from "@emotion/styled";

interface GoalSectionProps {
    calorieTotal: number,
    calorieGoal: number,
}

interface progressBarProps{
    width: string
}

const TotalCalDiv = styled.div<progressBarProps>`
  height: 30px;
  width: 90%;
  position: relative;

  display: flex;
  gap: 10px;
  justify-content: center;

  font-size: 24px;

  background-color: white;
  border-radius: 25px;
  
  .number {
    position: absolute;
    color: #343434;
  }

  .progressBar {
    width: ${props => props.width};
    height: inherit;
    background-color: #c3c3c3;
    border-radius: 25px;
    margin-right: auto;
  }
`

interface totalCalProps {
    total: number
    goal: number
}

const GoalSectionDiv = styled.div`
    background-color: #adadad;
    width: 90%;
    height: 100px;
    margin-bottom: 10px;
    border-radius: 10px;

    display: flex;
    justify-content: center;
    align-items: center;
`
function TotalCal(props: totalCalProps) {
    const {total, goal} = props

    const progressWidth = (`${(total / 2000 * 100).toString()}%`)
    console.log(progressWidth)

    const labelText = `${total} out of 2000."`

    return (
        <TotalCalDiv width={progressWidth}>
        <div className="progressBar">

        </div>
        <div className="number total" tabIndex={0} aria-label={labelText}>
            {total} / {goal}
        </div>
        </TotalCalDiv>
    )
}

export function GoalSection(props: GoalSectionProps) {
    const {calorieTotal, calorieGoal} = props
    return (
        <GoalSectionDiv>
            <TotalCal total={calorieTotal} goal={calorieGoal}/>
        </GoalSectionDiv>
    )
}
