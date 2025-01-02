import { UseQueryResult } from "@tanstack/react-query"
import styled from "@emotion/styled"

const PostSectionStyle = styled.div`
  width: 95%;
  height: min-content;

  display: flex;
  flex-direction: row;
  align-items: center;
  
  form {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding: 2px;
  }

  div.inputSection {
    display: flex;
    flex-direction: column;
    align-items: center;

    input {
      all: unset;

      width: 100%;
      height: 50px;
      border-radius: 5px;

      background-color: white;
    } 

    label {
      height: 20px;
    }

    div.fakeLabel {
      height: 20px;
      width: 100%;
    }

    .buttonContainer {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
    }
  }

  .buttons {
    width: 5%;
    margin-left: 5px;
  }

  .foodName {
    width: 50%;
  }

  .calories {
    width: 15%;
  }

  .carbs {
    width: 10%;
  }

  .protein {
    width: 10%;
  }

  .fat {
    width: 10%;
  }

  button.submit {
    width: 10px;
    height: 50px;
    border-radius: 50%;
    height: 35px;
    width: 35px;

    background-color: #4CAF50;
    color: white;
    font-size: 20px;

    border: none;
  }

  button.submit:hover {
    background-color: #45a049;
  }

  input:hover {
    background-color: #e6e6e6;
  }

`

interface postSectionProps {
  foodPost: UseQueryResult<any, Error>
  setPostReady: Function
  setFoodName: Function
  setCalories: Function
  setCarbs: Function
  setProtein: Function
  setFat: Function
}

export function PostSection(props: postSectionProps) {
    const {
        foodPost, setPostReady,
        setFoodName, setCalories, setCarbs, setProtein, setFat
    } = props
    
    return (
      <PostSectionStyle>
        <form className="formGrid" onSubmit={(e) => {
            e.preventDefault()
            setPostReady(true)
        }}>
            <div className="inputSection foodName">
              <label htmlFor="name">
                Food Name
              </label>
              <input
                id="name"
                name="Food Name"
                type="text"
                onChange={e => setFoodName(e.target.value)}
              />
            </div>
            
            <div className="inputSection calories">
              <label htmlFor="calories">
                Calories
              </label>
              <input
                id="calories"
                name="calories"
                type="number"
                min="1"
                onChange={e => setCalories(e.target.valueAsNumber)}
              />
            </div>

            <div className="inputSection carbs">
              <label htmlFor="carbs">
                Carbs
              </label>
              <input
                id="carbs"
                name="carbs"
                type="number"
                min="0"
                onChange={e => setCarbs(e.target.valueAsNumber)}
              />
            </div>

            <div className="inputSection protein">
              <label htmlFor="protein">
                Protein
              </label>
              <input
                id="protein"
                name="protein"
                type="number"
                min="0"
                onChange={e => setProtein(e.target.valueAsNumber)}
              />
            </div>

            <div className="inputSection fat">
              <label htmlFor="fat">
                Fat
              </label>
              <input
                id="fat"
                name="fat"
                type="number"
                min="0"
                onChange={e => setFat(e.target.valueAsNumber)}
              />
            </div>

            <div className="inputSection buttons">
              <div className="fakeLabel"/>
              <div className="buttonContainer">
                <button className="submit" type="submit">+</button>
              </div>
              
            </div>
            
            
        </form>
        {foodPost.data && foodPost.data["err"] && <>{foodPost.data["err"]}</>}
      </PostSectionStyle>  
    ) 
}