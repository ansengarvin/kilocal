import styled from "@emotion/styled"
import { FoodEntries } from "./FoodEntries"

const RecipeEntryRow = styled.tr`
  .recipeInfo {
    background-color: #727272;
    
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;

    border-color: #727272;

    height: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const RecipeEntryFoods = styled.div `
  width: 100%;
  border-style: solid;
  border-color: #727272;
`

const testFoods = [
  {
      name: "food1",
      calories: 100,
      carbs: 10,
      protein: 10,
      fat: 10,
      id: 1,
  },
  {
      name: "food2",
      calories: 200,
      carbs: 20,
      protein: 20,
      fat: 20,
      id: 2,
  },
  {
      name: "food3",
      calories: 300,
      carbs: 30,
      protein: 30,
      fat: 30,
      id: 3,
  }
]
const testTotalCal = testFoods.reduce((acc, curr) => acc + curr.calories, 0)
const testTotalCarbs = testFoods.reduce((acc, curr) => acc + curr.carbs, 0)
const testTotalProtein = testFoods.reduce((acc, curr) => acc + curr.protein, 0)


export function RecipeEntry() {
  return (
    <>
      <RecipeEntryRow>
        <td className="foodName">
          <div className = "recipeInfo">
            Recipe Name
          </div>
        </td>
        <td  className="calories">
          <div className = "recipeInfo">
            {testTotalCal}
          </div>
        </td>
        <td className="carbs">
          <div className = "recipeInfo">
            {testTotalCarbs}
          </div>
        </td>
        <td className="protein">
          <div className = "recipeInfo">
            {testTotalProtein}
          </div>
        </td>
        <td className="fat">
          <div className = "recipeInfo">
            0
          </div>
        </td>
        <td className="buttons">
          <div>
            <button>X</button>
          </div>
        </td>
      </RecipeEntryRow>
      <tr>
        <td colSpan={6}>
          <RecipeEntryFoods>
            <FoodEntries foodList={testFoods} hasRecipes={false} hasTitles={false} width={'100%'}/>
          </RecipeEntryFoods>
        </td>
      </tr>
    </>
    
  )
}