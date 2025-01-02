import { UseQueryResult } from "@tanstack/react-query"
import styled from "@emotion/styled"

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.553);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const PostSectionDiv = styled.div`
  position: relative;
  padding-top: 10px;
  background-color: #adadad;
  border-radius: 10px;
  width: 600px;
  height: 650px;

  display: flex;
  flex-direction: column;
  align-items: center;
  
  button.x {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  div.inputSection {
    width: 90%;
    display: flex;
    flex-direction: column;
  }

  form {
    width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
  
  input {
    all: unset;

    width: 100%;
    height: 50px;
    border-radius: 5px;

    background-color: white;
  }

  button.submit {
    width: 90%;
    height: 50px;
    border-radius: 5px;

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
  setPostWindowHidden: Function
  setPostReady: Function
  setFoodName: Function
  setCalories: Function
  setCarbs: Function
  setProtein: Function
  setFat: Function
}

export function OldPostSection(props: postSectionProps) {
    const {
        foodPost, setPostReady, setPostWindowHidden,
        setFoodName, setCalories, setCarbs, setProtein, setFat
    } = props
    
    return (
        <ModalBackdrop>
          <PostSectionDiv>
            <h2>
              Add a food
            </h2>
            <button className="x" onClick={() => {
              setPostWindowHidden(true)
            }}>
              X
            </button>
            
            <form className="formGrid" onSubmit={(e) => {
                e.preventDefault()
                setPostReady(true)
                setPostWindowHidden(true)
            }}>
                <div className="inputSection">
                  <label htmlFor="name">
                    Food Name
                  </label>
                  <input
                    className="leftInput"
                    id="name"
                    name="Food Name"
                    type="text"
                    onChange={e => setFoodName(e.target.value)}
                  />
                </div>
                
                <div className="inputSection">
                  <label htmlFor="calories">
                    Calories
                  </label>
                  <input
                    id="calories"
                    className="rightInput"
                    name="calories"
                    type="number"
                    min="1"
                    onChange={e => setCalories(e.target.valueAsNumber)}
                  />
                </div>

                <div className="inputSection">
                  <label htmlFor="carbs">
                    Carbs (Optional)
                  </label>
                  <input
                    id="carbs"
                    className="leftInput"
                    name="carbs"
                    type="number"
                    min="0"
                    onChange={e => setCarbs(e.target.valueAsNumber)}
                  />
                </div>

                <div className="inputSection">
                  <label htmlFor="protein">
                    Protein (Optional)
                  </label>
                  <input
                    id="protein"
                    className="rightInput"
                    name="protein"
                    type="number"
                    min="0"
                    onChange={e => setProtein(e.target.valueAsNumber)}
                  />
                </div>

                <div className="inputSection">
                  <label htmlFor="fat">
                    Fat (Optional)
                  </label>
                  <input
                    id="fat"
                    className="leftInput"
                    name="fat"
                    type="number"
                    min="0"
                    onChange={e => setFat(e.target.valueAsNumber)}
                  />
                </div>

                <button className="submit" type="submit">Add Food</button>
                
            </form>
            {foodPost.data && foodPost.data["err"] && <>{foodPost.data["err"]}</>}
          </PostSectionDiv>
        </ModalBackdrop>
        
    ) 
}