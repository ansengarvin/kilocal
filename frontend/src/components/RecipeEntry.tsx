import styled from "@emotion/styled"
import { FoodEntries } from "./FoodEntries"

const RecipeEntryDiv = styled.div`
  width: 100%;
  height: 100px;

  div.recipeTitleContainer {
    display: flex;
    flex-direction: row;

    button {
      margin-left: auto;
      width: 30px;
      height: 30px;
    }
  }

  div.recipeName {
    background-color: #727272;

    border-top-style: solid;
    border-left-style: solid;
    border-right-style: solid;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;

    border-color: #727272;

    width: 380px;
    margin-left: 5px;
    margin-right: 10px;

    height: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  div.recipeTableDiv {
    width: 100%;
    min-height: 30px;
    padding-top: 5px;

    border-style: solid;
    border-color: #727272;
    border-radius: 5px;
  }
`

export function RecipeEntry() {

    const testFoods = [
        {
            name: "food1",
            calories: 100,
            id: 1,
        },
        {
            name: "food2",
            calories: 200,
            id: 2,
        },
        {
            name: "food3",
            calories: 300,
            id: 3,
        }
    ]


  return (
    <tr>
      <td colSpan={3}>
        <RecipeEntryDiv>
          <div className="recipeTitleContainer">
            <div className="recipeName">
              Recipe Name
            </div>  
            <button>x</button>
          </div>
          
          <div className="recipeTableDiv">
            <FoodEntries foodList={testFoods} hasRecipes={false} width={'100%'}></FoodEntries>
          </div>
        </RecipeEntryDiv>
      </td>
    </tr>
  )
}