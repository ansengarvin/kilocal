import { UseQueryResult } from "@tanstack/react-query"
import { Icon } from "../../lib/icons/Icon"
import { FoodEntryStyle } from "../styles/FoodEntryStyle"

interface postSectionProps {
  foodPost: UseQueryResult<any, Error>
  foodName: string
  calories: number
  carbs: number
  protein: number
  fat: number
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
        foodName, calories, carbs, protein, fat,
        setFoodName, setCalories, setCarbs, setProtein, setFat
    } = props
    
    return (
      <FoodEntryStyle>
        <form className="entryContainer" onSubmit={(e) => {
            e.preventDefault()
            setPostReady(true)
        }}>
            <div className="row">
              <label htmlFor="name" className="foodName">
                Food
              </label>
              <label htmlFor="calories" className="calories">
                Calories
              </label>
              <label htmlFor="carbs" className="macro">
                Carbs
              </label>
              <label htmlFor="protein" className="macro">
                Protein
              </label>
              <label htmlFor="fat" className="macro">
                Fat
              </label>
              <div className="buttonContainer"/>
            </div>
            <div className="row">
              <input
                className="stat foodName"
                id="name"
                name="Food Name"
                type="text"
                autoComplete="off"
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
              />
              <input
                className="stat calories"
                id="calories"
                name="calories"
                type="number"
                min="0"
                value={calories}
                onChange={e => setCalories(e.target.valueAsNumber)}
              />
              <input
                className="stat macro"
                id="carbs"
                name="carbs"
                type="number"
                min="0"
                value={carbs}
                onChange={e => setCarbs(e.target.valueAsNumber)}
              />
              <input
                className="stat macro"
                id="protein"
                name="protein"
                type="number"
                min="0"
                value={protein}
                onChange={e => setProtein(e.target.valueAsNumber)}
              />
              <input
                className="stat macro"
                id="fat"
                name="fat"
                type="number"
                min="0"
                value={fat}
                onChange={e => setFat(e.target.valueAsNumber)}
              />
              <div className="buttonContainer">
                <button className="submit" type="submit">
                  <Icon
                    iconName="add"
                    color={'#ffffff'}
                  />
                </button>
              </div>         
            </div>
        </form>
        {foodPost.data && foodPost.data["err"] && <>{foodPost.data["err"]}</>}
      </FoodEntryStyle>  
    ) 
}