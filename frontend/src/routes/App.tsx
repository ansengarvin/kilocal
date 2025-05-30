import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ContentWindow } from "../components/styles/AppStyle";
import styled from "@emotion/styled";
import { FoodEntries } from "../components/data/FoodEntries";
import { GoalSection } from "../components/appSections/GoalSection";
import { PostSection } from "../components/appSections/PostSection";
import { firebaseAuth } from "../lib/firebase";
import { Landing } from "../components/global/Landing";
import { apiURL, appAccentColor, appAccentHover, mobileView } from "../lib/defines";
import { ArrowBackiOSIcon } from "../lib/icons/ArrowBackiOSIcon";
import { ArrowForwardiOSIcon } from "../lib/icons/ArrowForwardiOSIcon";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";

function App() {
    const navigate = useNavigate();

    const { loggedIn, verified, isLoadingInitial } = useOutletContext<{
        loggedIn: boolean;
        verified: boolean;
        isLoadingInitial: boolean;
    }>();

    // Redirects
    useEffect(() => {
        if (!isLoadingInitial) {
            if (loggedIn) {
                if (!verified) {
                    navigate("/verify");
                }
            }
        }
    }, [verified, loggedIn]);

    const journal = useSelector((state: RootState) => state.journal);
    const dispatch = useDispatch();

    const [postReady, setPostReady] = useState(false);
    const [foodName, setFoodName] = useState("");
    const [calories, setCalories] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);

    const [deleteID, setDeleteID] = useState(0);
    const [deleteReady, setDeleteReady] = useState(false);

    const foodGet = useQuery({
        enabled: loggedIn ? true : false,
        queryKey: ["day", journal.apiDate],
        queryFn: async () => {
            const token = await firebaseAuth.currentUser?.getIdToken();
            const url = `${apiURL}/days/${journal.apiDate}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            // Print to console if 500
            if (response.status == 500) {
                console.log(response);
            }
            return response.json();
        },
    });

    const foodPost = useQuery({
        enabled: postReady ? true : false,
        queryKey: ["foodPost", journal.apiDate, calories, foodName],
        queryFn: async () => {
            const queryBody = JSON.stringify({
                name: foodName,
                calories: calories,
                carbs: carbs,
                protein: protein,
                fat: fat,
            });

            setPostReady(false);
            setCalories(0);
            setCarbs(0);
            setProtein(0);
            setFat(0);
            setFoodName("");

            const token = await firebaseAuth.currentUser?.getIdToken();
            const url = `${apiURL}/days/${journal.apiDate}/food`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: queryBody,
            });

            foodGet.refetch();
            return response.json();
        },
    });

    // Food Delete Query
    useQuery({
        enabled: deleteReady ? true : false,
        queryKey: ["foodDelete", deleteID],
        queryFn: async () => {
            const token = await firebaseAuth.currentUser?.getIdToken();
            const url = `${apiURL}/days/${journal.apiDate}/food/${deleteID}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            setDeleteReady(false);
            foodGet.refetch();
            return response;
        },
    });

    if (!loggedIn) {
        return <Landing />;
    } else {
        return (
            <ContentWindow>
                <DateSection className="appWindow">
                    <button
                        className="date left"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({ type: "journal/prevDay" });
                            console.log("PREV DAY");
                        }}
                    >
                        <ArrowBackiOSIcon color={"#ffffff"} />
                    </button>

                    <h1 tabIndex={0}>{journal.dayName}</h1>

                    <button
                        className="date right"
                        disabled={journal.isToday}
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({ type: "journal/nextDay" });
                        }}
                    >
                        <ArrowForwardiOSIcon color={"#ffffff"} />
                    </button>
                </DateSection>
                {foodGet.data ? (
                    <GoalSection
                        calorieTotal={foodGet.data?.totalCalories}
                        calorieGoal={2000}
                        carbTotal={foodGet.data?.totalCarbs}
                        carbGoal={300}
                        proteinTotal={foodGet.data?.totalProtein}
                        proteinGoal={100}
                        fatTotal={foodGet.data?.totalFat}
                        fatGoal={50}
                    />
                ) : (
                    <GoalSection
                        calorieTotal={0}
                        calorieGoal={2000}
                        carbTotal={0}
                        carbGoal={300}
                        proteinTotal={0}
                        proteinGoal={100}
                        fatTotal={0}
                        fatGoal={50}
                    />
                )}
                <FoodJournal className="appWindow">
                    <h2>Add a Food</h2>
                    <PostSection
                        foodPost={foodPost}
                        foodName={foodName}
                        calories={calories}
                        carbs={carbs}
                        protein={protein}
                        fat={fat}
                        setPostReady={setPostReady}
                        setFoodName={setFoodName}
                        setCalories={setCalories}
                        setCarbs={setCarbs}
                        setProtein={setProtein}
                        setFat={setFat}
                    />
                    <br />
                    <h2>Food Journal</h2>
                    {foodGet.data?.food && foodGet.data?.food.length == 0 && <span>No food for this day yet!</span>}

                    {foodGet.data?.food && foodGet.data?.food.length != 0 && (
                        <FoodEntries
                            foodList={foodGet.data.food}
                            setDeleteID={setDeleteID}
                            setDeleteReady={setDeleteReady}
                            hasRecipes={false}
                            hasTitles={true}
                        />
                    )}
                </FoodJournal>
            </ContentWindow>
        );
    }
}

const DateSection = styled.div`
    position: relative;
    height: auto;
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 10px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    h2 {
        font-size: 18px;
        margin: 0;
        margin-bottom: 10px;
    }

    button.left {
        position: absolute;
        left: 10px;

        svg {
            margin-right: 5px;
        }
    }
    button.right {
        position: absolute;
        right: 10px;

        svg {
            margin-left: 5px;
        }
    }
    button {
        // Remove all button styling
        border: none;
        outline: none;
        margin: 0;
        height: 50px;
        width: 50px;

        @media (max-width: ${mobileView}) {
            height: 35px;
            width: 35px;
        }

        background-color: ${appAccentColor};
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        :hover {
            background-color: ${appAccentHover};
            // Fade out
        }

        :disabled {
            background-color: #d3d3d3;
        }
    }
`;

const FoodJournal = styled.div`
    border-radius: 10px;
    height: min-content;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;

    div.postSection {
        width: 95%;
        height: 10px;
        background-color: green;
    }

    span {
        margin-top: 10px;
        margin-bottom: 10px;
    }
`;

export default App;
