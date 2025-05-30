import { FoodEntryStyle } from "../styles/FoodEntryStyle";
import { AddIcon } from "../../lib/icons/AddIcon";
import { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { journalDispatch } from "../../redux/journalSlice";

export function PostSection() {
    const [foodName, setFoodName] = useState("");
    const [calories, setCalories] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const dispatch = useAppDispatch();
    return (
        <FoodEntryStyle>
            <form
                className="entryContainer"
                onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(
                        journalDispatch.postFoodEntry({
                            name: foodName,
                            calories: calories,
                            carbs: carbs,
                            protein: protein,
                            fat: fat,
                            amount: 1, // Default amount is 1
                        }),
                    );
                }}
            >
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
                    <div className="buttonContainer" />
                </div>
                <div className="row">
                    <input
                        className="stat foodName"
                        id="name"
                        name="Food Name"
                        type="text"
                        autoComplete="off"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                    />
                    <input
                        className="stat calories"
                        id="calories"
                        name="calories"
                        type="number"
                        min="0"
                        value={calories}
                        onChange={(e) => setCalories(e.target.valueAsNumber)}
                    />
                    <input
                        className="stat macro"
                        id="carbs"
                        name="carbs"
                        type="number"
                        min="0"
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.valueAsNumber)}
                    />
                    <input
                        className="stat macro"
                        id="protein"
                        name="protein"
                        type="number"
                        min="0"
                        value={protein}
                        onChange={(e) => setProtein(e.target.valueAsNumber)}
                    />
                    <input
                        className="stat macro"
                        id="fat"
                        name="fat"
                        type="number"
                        min="0"
                        value={fat}
                        onChange={(e) => setFat(e.target.valueAsNumber)}
                    />
                    <div className="buttonContainer">
                        <button className="submit" type="submit">
                            <AddIcon color={"#ffffff"} />
                        </button>
                    </div>
                </div>
            </form>
        </FoodEntryStyle>
    );
}
