import { UseQueryResult } from "@tanstack/react-query"
import styled from "@emotion/styled"

interface postSectionProps {
    foodPost: UseQueryResult<any, Error>
    setPostReady: Function
    setFoodName: Function
    setCalories: Function
}

const PostSectionDiv = styled.div`
  background-color: #adadad;
  border-radius: 10px;
  width: 90%;
  height: 100px;
  margin-bottom: 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .interior {
    margin: 10px;
  }
  .formGrid{
    display: grid;
    grid-template-areas:
    "leftlabel rightlabel empty"
    "leftinput rightinput button";
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    .leftLabel {
      grid-area: leftlabel;
    }
    .rightLabel {
      grid-area: rightlabel;
    }
    .leftInput {
      grid-area: leftinput;
    }
    .rightInput {
      grid-area: rightinput;
    }
    .button {
      grid-area: button
    }
  }
`

export function PostSection(props: postSectionProps) {
    const {
        foodPost, setPostReady,
        setFoodName, setCalories
    } = props
    
    return (
        <PostSectionDiv>
            <div className="interior">
            <form className="formGrid" onSubmit={(e) => {
                e.preventDefault()
                setPostReady(true)
            }}>
                <label className="leftLabel" htmlFor="Food Name">Name</label>
                <input className="leftInput" name="Food Name" type="text" onChange={e => setFoodName(e.target.value)}/>
                <label className="rightLabel" htmlFor="calories">Calories</label>
                <input className="rightInput" name="calories" type="number" min="1" defaultValue="1" onChange={e => setCalories(e.target.valueAsNumber)}/>
                <button className="button" type="submit">Add Food</button>
            </form>
            </div>
            {foodPost.data && foodPost.data["err"] && <>{foodPost.data["err"]}</>}
        </PostSectionDiv>
    ) 
}