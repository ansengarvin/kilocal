import styled from "@emotion/styled"

const bgColor = '#adadad'

interface foodEntriesProps {
  foodList: Array<Object>
  setDeleteID?: Function
  setDeleteReady?: Function
}

const FoodEntryTable = styled.table`
  width: 95%;

  td.foodName {
    background-color: white;
  }

  td.calories {
    background-color: white;
  }

  td.buttons {
    width: 30px;

    button {
      width: 100%;
      aspect-ratio: 1; 
    }
  }
`

export function FoodEntries(props: foodEntriesProps) {
  const {foodList, setDeleteID, setDeleteReady} = props
  return (
    <FoodEntryTable tabIndex={0}>
      <thead>
        <tr>
          <th id='start'>Name</th>
          <th>Calories</th>
        </tr>
      </thead>
      <tbody>
        {foodList.map((food: any) => (
          <tr key={food.id}>
            <td className="foodName">{food.name}</td>
            <td className="calories" aria-label={`${450} calories`}>{food.calories}</td>
            {setDeleteID && setDeleteReady && 
              <td className="buttons" aria-label="Buttons to edit food item ">
                <button tabIndex={-1} aria-label={`Button: Delete ${food.name} from day`} onClick={() => {
                  setDeleteID(food.id)
                  setDeleteReady(true)
                }}>
                  x
              </button>
          </td>
            }
            
          </tr>
        ))}
      </tbody>
      
    </FoodEntryTable>
  )
}