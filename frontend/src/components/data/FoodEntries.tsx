import { RecipeEntry } from "./RecipeEntry"
import { FoodEntryStyle } from "../styles/FoodEntryStyle"
import { RemoveIcon } from "../../lib/icons/RemoveIcon"

interface foodEntriesProps {
  foodList: Array<Object>
  setDeleteID?: Function
  setDeleteReady?: Function
  hasRecipes: boolean
  hasTitles: boolean
}

export function FoodEntries(props: foodEntriesProps) {
  const {foodList, setDeleteID, setDeleteReady, hasRecipes, hasTitles} = props
  return (
    <FoodEntryStyle>
      <table className="entryContainer" tabIndex={0}>
        {
          hasTitles ?
            <thead>
              <tr>
                <th className="foodName">Food</th>
                <th className="calories">Calories</th>
                <th className="carbs">Carbs</th>
                <th className="protein">Protein</th>
                <th className="fat">Fat</th>
                <th className="buttons"> </th>
              </tr>
          </thead> :
          <></>
        }
        
        <tbody>
          {foodList.slice().reverse().map((food: any) => (
            <tr key={food.id}>
              <td className="foodName">
                <div className="entry stat">
                  {food.name}
                </div>
              </td>

              <td className="calories" aria-label={`${food.i} calories`}>
                <div className="entry stat">
                  {food.calories}
                </div>
              </td>

              <td className="macro" aria-label={`${food.carbs} grams of carbs`}>
                <div className="entry stat">
                  {food.carbs}
                </div>
              </td>

              <td className="macro" aria-label={`${food.protein} grams of protein`}>
                <div className="entry stat">
                  {food.protein}
                </div>
              </td>

              <td className="macro" aria-label={`${food.fat} grams of fat`}>
                <div className="entry stat">
                  {food.fat}
                </div>
              </td>

              {setDeleteID && setDeleteReady && 
                <td className="buttons" aria-label="Buttons to edit food item ">
                  <div className="buttonContainer">
                    <button className="delete" tabIndex={-1} aria-label={`Button: Delete ${food.name} from day`} onClick={() => {
                      setDeleteID(food.id)
                      setDeleteReady(true)
                    }}>
                      <RemoveIcon
                        color={'#ffffff'}
                      />
                    </button>
                  </div>
                </td>
              }
              {(!setDeleteID || !setDeleteReady) &&
                <td className="buttons" aria-hidden="true">
                  <div className="buttonContainer"/>
                </td>
              }
            </tr> 
          ))}
          {hasRecipes && 
            <RecipeEntry/>
          }
        </tbody>
      </table>
    </FoodEntryStyle>
    
  )
}