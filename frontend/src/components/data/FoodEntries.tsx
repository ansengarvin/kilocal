import { FoodEntryStyle } from "../styles/FoodEntryStyle";
import { RemoveIcon } from "../../lib/icons/RemoveIcon";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { journalDispatch } from "../../redux/journalSlice";

export function FoodEntries() {
    const food = useSelector((state: RootState) => state.journal.food);
    const dispatch = useAppDispatch();
    return (
        <FoodEntryStyle>
            <table className="entryContainer" tabIndex={0}>
                <thead>
                    <tr>
                        <th className="foodName">Food</th>
                        <th className="calories">Calories</th>
                        <th className="carbs">Carbs</th>
                        <th className="protein">Protein</th>
                        <th className="fat">Fat</th>
                        <th className="buttons"> </th>
                    </tr>
                </thead>

                <tbody>
                    {food
                        .slice()
                        .reverse()
                        .map((food: any) => (
                            <tr key={food.id}>
                                <td className="foodName">
                                    <div className="entry stat">{food.name}</div>
                                </td>

                                <td className="calories" aria-label={`${food.i} calories`}>
                                    <div className="entry stat">{food.calories}</div>
                                </td>

                                <td className="macro" aria-label={`${food.carbs} grams of carbs`}>
                                    <div className="entry stat">{food.carbs}</div>
                                </td>

                                <td className="macro" aria-label={`${food.protein} grams of protein`}>
                                    <div className="entry stat">{food.protein}</div>
                                </td>

                                <td className="macro" aria-label={`${food.fat} grams of fat`}>
                                    <div className="entry stat">{food.fat}</div>
                                </td>
                                <td className="buttons" aria-label="Buttons to edit food item ">
                                    <div className="buttonContainer">
                                        <button
                                            className="delete"
                                            tabIndex={-1}
                                            aria-label={`Button: Delete ${food.name} from day`}
                                            onClick={() => {
                                                dispatch(journalDispatch.clearAllErrors());
                                                dispatch(journalDispatch.deleteFoodEntry(food.id));
                                            }}
                                        >
                                            <RemoveIcon color={"#ffffff"} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </FoodEntryStyle>
    );
}
