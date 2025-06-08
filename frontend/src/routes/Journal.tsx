import { useEffect } from "react";
import { ContentWindow } from "../components/styles/AppStyle";
import styled from "@emotion/styled";
import { FoodEntries } from "../components/data/FoodEntries";
import { GoalSection } from "../components/appSections/GoalSection";
import { PostSection } from "../components/appSections/PostSection";
import { Landing } from "../components/global/Landing";
import { appAccentColor, appAccentHover, mobileView } from "../lib/defines";
import { ArrowBackiOSIcon } from "../lib/icons/ArrowBackiOSIcon";
import { ArrowForwardiOSIcon } from "../lib/icons/ArrowForwardiOSIcon";
import { RootState, useAppDispatch } from "../redux/store";
import { useSelector } from "react-redux";
import { journalDispatch } from "../redux/journalSlice";

export function Journal() {
    const loggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const verified = useSelector((state: RootState) => state.user.isVerified);

    const journal = useSelector((state: RootState) => state.journal);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (loggedIn && verified) {
            dispatch(journalDispatch.fetchDayByDate());
        }
    }, [loggedIn, verified, dispatch]);

    /*  
        At the end of post/delete dispatches, fetch is called to refresh data.
        This means isPosting/isDeleting is momentarily true at the same time as isFetching.
        To avoid content shift / flickering, prioritize displaying isFetching.
    */
    let statusMessage = "";
    if (journal.isFetching) {
        statusMessage = "Loading journal data...";
    } else if (journal.isPosting) {
        statusMessage = "Posting food entry...";
    } else if (journal.isDeleting) {
        statusMessage = "Deleting food entry...";
    } else if (journal.postError) {
        statusMessage = `Error posting food entry: ${journal.postError}`;
    } else if (journal.deleteError) {
        statusMessage = `Error deleting food entry: ${journal.deleteError}`;
    } else if (journal.fetchError) {
        statusMessage = `Error fetching journal data: ${journal.fetchError}`;
    } else {
        statusMessage = "";
    }

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
                            dispatch(journalDispatch.clearAllErrors());
                            dispatch(journalDispatch.prevDay());
                            dispatch(journalDispatch.fetchDayByDate());
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
                            dispatch(journalDispatch.clearAllErrors());
                            dispatch(journalDispatch.nextDay());
                            dispatch(journalDispatch.fetchDayByDate());
                        }}
                    >
                        <ArrowForwardiOSIcon color={"#ffffff"} />
                    </button>
                </DateSection>
                <GoalSection
                    calorieTotal={journal.totalCalories}
                    calorieGoal={2000}
                    carbTotal={journal.totalCarbs}
                    carbGoal={300}
                    proteinTotal={journal.totalCalories}
                    proteinGoal={100}
                    fatTotal={journal.totalFat}
                    fatGoal={50}
                />
                <FoodJournal className="appWindow">
                    <h2>Add a Food</h2>
                    <PostSection />
                    <br />
                    <h2>Food Journal</h2>
                    <span>{statusMessage}</span>
                    {journal.food && journal.food.length > 0 ? <FoodEntries /> : <span>No food for this day yet!</span>}
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
