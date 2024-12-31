import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import { ContentWindow } from "../components/global/ContentWindow";
import styled from "@emotion/styled";
import { FoodEntries } from "../components/data/FoodEntries";
import { GoalSection } from "../components/appSections/GoalSection";
import { PostSection } from "../components/appSections/PostSection";
import { Icon } from "../components/icons/Icon";

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${month}-${day}`
}

const DateSection = styled.div`
  position: relative;
  height: auto;
  width: 90%;
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
  button.date {
    // Remove all button styling
    border: none;
    outline: none;
    margin: 0;
    height: 50px;
    width: 50px;

    background-color: #626262;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
      background-color: #8a8a8a;
    }
  }
`


const FoodJournal = styled.div`
  border-radius: 10px;
  height: min-content;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
`

function App() {
  const {loggedIn} = useOutletContext<{loggedIn: boolean}>()

  const [dayDate, setDayDate] = useState(new Date())
  const [formattedDate, setFormattedDate] = useState(formatDate(dayDate))
  const [isCurrentDay, setIsCurrentDay] = useState(true)

  const [postWindowHidden, setPostWindowHidden] = useState(true)
  const [postReady, setPostReady] = useState(false)
  const [foodName, setFoodName] = useState("")
  const [calories, setCalories] = useState(1)
  const [carbs, setCarbs] = useState(0)
  const [protein, setProtein] = useState(0)
  const [fat, setFat] = useState(0)
  

  const [deleteID, setDeleteID] = useState(0)
  const [deleteReady, setDeleteReady] = useState(false)

  const foodGet = useQuery({
    enabled: (loggedIn ? true : false),
    queryKey: ["day", formattedDate],
    queryFn: async () => {
      const url = `http://localhost:8000/days/${formattedDate}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + Cookies.get("auth")
        }
      })
      return response.json()
    }
  })

  const foodPost = useQuery({
    enabled: (postReady ? true: false),
    queryKey: ["foodPost", formattedDate, calories, foodName],
    queryFn: async () => {
      const url = `http://localhost:8000/days/${formattedDate}/food`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + Cookies.get("auth")
        },
        body: JSON.stringify({
          name: foodName,
          calories: calories,
          carbs: carbs,
          protein: protein,
          fat: fat
        })
      })
      setPostReady(false)
      setCalories(0)
      setCarbs(0)
      setProtein(0)
      setFat(0)
      setFoodName("")
      foodGet.refetch()
      return response.json()
    }
  })

  const foodDelete = useQuery({
    enabled: (deleteReady ? true : false),
    queryKey: ["foodDelete", deleteID],
    queryFn: async () => {
      const url = `http://localhost:8000/days/${formattedDate}/food/${deleteID}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          "Authorization": "Bearer " + Cookies.get("auth")
        }
      })
      setDeleteReady(false)
      foodGet.refetch()
      return response
    }
  })

  // Effect used to disable the next-day button if it's the current day.
  useEffect(() => {
    const today = new Date()
    if (formatDate(today) == formattedDate) {
      setIsCurrentDay(true)
    } else {
      setIsCurrentDay(false)
    }
  }, [formattedDate])

  useEffect(() => {
    if (foodDelete.error) {
      console.log(foodDelete.error)
    }
  })

  return (
    <>
      {
        postWindowHidden ?
        <></> :
        <PostSection
          foodPost={foodPost}
          setPostWindowHidden={setPostWindowHidden}
          setPostReady={setPostReady}
          setFoodName={setFoodName}
          setCalories={setCalories}
          setCarbs={setCarbs}
          setProtein={setProtein}
          setFat={setFat}
        />
      }
      <ContentWindow>
        <div className='content'>
          <DateSection className="appElement">
            <button className="date left" onClick={(e) => {
                e.preventDefault
                const newDate = new Date()
                newDate.setDate(dayDate.getDate() - 1)
                setDayDate(newDate)
                setFormattedDate(formatDate(newDate))
              }}>
                <Icon iconName="backArrow" color={'#ffffff'}/>
              </button>
            
            <h1 tabIndex={0}>{dayDate.toLocaleString('default', {month: 'long'})} {dayDate.getDate()}, {dayDate.getFullYear()}</h1>

            <button className="date right" disabled={isCurrentDay} onClick={(e) => {
                e.preventDefault
                const newDate = new Date()
                newDate.setDate(dayDate.getDate() + 1)
                setDayDate(newDate)
                setFormattedDate(formatDate(newDate))
              }}>
                <Icon iconName="forwardArrow" color={'#ffffff'}/>
              </button>
          </DateSection>
          <GoalSection
            calorieTotal={foodGet.data?.totalCalories} calorieGoal={2000}
            carbTotal={foodGet.data?.totalCarbs} carbGoal={300}
            proteinTotal={foodGet.data?.totalProtein} proteinGoal={100}
            fatTotal={foodGet.data?.totalFat} fatGoal={50}
          />
          <FoodJournal className="appElement">
            <h2>
              Food Journal
            </h2>
            <button onClick={() => {
              setPostWindowHidden(false)
            }}>
              Add Food
            </button>
            <br/>
            {foodGet.data?.food && foodGet.data?.food.length == 0 && <p>
              No food for this day yet!
            </p>}
            {foodGet.data?.food && foodGet.data?.food.length != 0 &&
              <FoodEntries
                foodList={foodGet.data.food}
                setDeleteID={setDeleteID}
                setDeleteReady={setDeleteReady}
                hasRecipes={false}
                hasTitles={true}
                width={'95%'}
              />
            }
          </FoodJournal>
        </div>    
      </ContentWindow>  
    </>
    
  )
}

export default App
