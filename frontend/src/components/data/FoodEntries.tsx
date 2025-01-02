import styled from "@emotion/styled"
import { RecipeEntry } from "./RecipeEntry"
import { Icon } from "../icons/Icon"

interface foodEntriesProps {
  foodList: Array<Object>
  setDeleteID?: Function
  setDeleteReady?: Function
  hasRecipes: boolean
  hasTitles: boolean
  width?: string
}

interface foodEntryTableProps {
  width?: string;
}

const FoodEntryTable = styled.table<foodEntryTableProps>`
  width: ${(props) => props.width};

  td {
    height: auto
  }

  div.info {
    background-color: #f0f0f0;
    border-radius: 5px;

    margin-bottom: 10px;

    height: 50px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  th {
    height: 20px;
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

  td.buttons {
    width: 5%;
    div.buttonContainer {
      height: 50px;
      background-color: transparent;
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin-bottom: 10px;
      gap: 5px;
      margin-left: 5px;
    }
  }

  button {
    height: 35px;
    width: 35px;
    border: none;
    border-radius: 50%;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button.delete {
    background-color: #db3e3e;
    padding: 5px;
  }

  button.delete:hover {
    background-color: #ff5050;
  }

  button.edit {
    background-color: #474747;
    padding: 5px;
  }

  button.edit:hover {
    background-color: #626262;
  }
`

export function FoodEntries(props: foodEntriesProps) {
  const {foodList, setDeleteID, setDeleteReady, hasRecipes, hasTitles, width} = props
  return (
    <FoodEntryTable tabIndex={0} width={width}>
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
        {foodList.map((food: any) => (
          <tr key={food.id}>
            <td className="foodName">
              <div className="info">
                {food.name}
              </div>
            </td>

            <td className="calories" aria-label={`${food.i} calories`}>
              <div className="info">
                {food.calories}
              </div>
            </td>

            <td className="carbs" aria-label={`${food.carbs} grams of carbs`}>
              <div className="info">
                {food.carbs}
              </div>
            </td>

            <td className="protein" aria-label={`${food.protein} grams of protein`}>
              <div className="info">
                {food.protein}
              </div>
            </td>

            <td className="fat" aria-label={`${food.fat} grams of fat`}>
              <div className="info">
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
                    <Icon
                      iconName="delete"
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
      
    </FoodEntryTable>
  )
}