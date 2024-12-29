import styled from "@emotion/styled"
import { RecipeEntry } from "./RecipeEntry"

interface foodEntriesProps {
  foodList: Array<Object>
  setDeleteID?: Function
  setDeleteReady?: Function
  hasRecipes: boolean
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
    background-color: white;
    border-radius: 5px;

    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 10px;

    height: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .foodName {
    width: 400px;
  }

  .calories {
    width: 200px;
  }

  td.buttons {
    width: 30px;

    div.buttonContainer {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin-bottom: 10px;
    }

    button {
      width: 30px;
      aspect-ratio: 1;
    }
  }
`

export function FoodEntries(props: foodEntriesProps) {
  const {foodList, setDeleteID, setDeleteReady, hasRecipes, width} = props
  return (
    <FoodEntryTable tabIndex={0} width={width}>
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

            {setDeleteID && setDeleteReady && 
              <td className="buttons" aria-label="Buttons to edit food item ">
                <div className="buttonContainer">
                  <button tabIndex={-1} aria-label={`Button: Delete ${food.name} from day`} onClick={() => {
                    setDeleteID(food.id)
                    setDeleteReady(true)
                  }}>
                    x
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