import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import { ContentWindow } from "../components/ContentWindow";
import styled from "@emotion/styled";

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${month}-${day}`
}

const PostSection = styled.div`
  background-color: white;
  border-radius: 10px;
  width: 80%;
  height: 100px;
  margin-bottom: 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .interior {
    margin: 10px;
  }
  .formGrid{
    display: grid;
    grid-template-areas:
    "leftlabel rightlabel empty"
    "leftinput rightinput button";
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    .leftLabel {
      grid-area: leftlabel;
    }
    .rightLabel {
      grid-area: rightlabel;
    }
    .leftInput {
      grid-area: leftinput;
    }
    .rightInput {
      grid-area: rightinput;
    }
    .button {
      grid-area: button
    }
  }
`

const FoodSection = styled.div`
  background-color: white;
  border-radius: 10px;
  height: 100%;
  width: 80%;
`

function App() {
  const {loggedIn} = useOutletContext<{loggedIn: boolean}>()

  const [dayDate, setDayDate] = useState(new Date())
  const [formattedDate, setFormattedDate] = useState(formatDate(dayDate))
  const [isCurrentDay, setIsCurrentDay] = useState(true)
  const [postReady, setPostReady] = useState(false)
  const [calories, setCalories] = useState(1)
  const [foodName, setFoodName] = useState("")

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
          calories: calories,
          name: foodName
        })
      })
      setPostReady(false)
      setCalories(1)
      setFoodName("")
      window.location.reload()
      return response.json()
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

  return (
    <ContentWindow>
      <div className='left side'>
        <button onClick={(e) => {
          e.preventDefault
          const newDate = new Date()
          newDate.setDate(dayDate.getDate() - 1)
          setDayDate(newDate)
          setFormattedDate(formatDate(newDate))
        }}>LT</button>
      </div>

      <div className='content'>
        <h1>{loggedIn ? <>{formattedDate}</> : <>Not Logged In</>}</h1>  
        {foodGet.isLoading ? <>Loading</> : <></>}
        {foodGet.error ? <>Error</> : <></>}
        <PostSection>
          <div className="interior">
            <form className="formGrid" onSubmit={(e) => {
              e.preventDefault()
              setPostReady(true)
            }}>
              <label className="leftLabel" htmlFor="Food Name">Name</label>
              <input className="leftInput" name="Food Name" type="text" onChange={e => setFoodName(e.target.value)}/>
              <label className="rightLabel" htmlFor="calories">Calories</label>
              <input className="rightInput" name="calories" type="number" min="1" defaultValue="1" onChange={e => setCalories(e.target.valueAsNumber)}/>
              <button className="button" type="submit">Add Food</button>
            </form>
          </div>
          
          
          {foodPost.data && foodPost.data["err"] && <>{foodPost.data["err"]}</>}
        </PostSection>
        <FoodSection>
          {foodGet.data?.food && foodGet.data?.food.length == 0 && <p>
            No food for this day yet!
          </p>}
          {foodGet.data?.food && foodGet.data?.food.length != 0 && foodGet.data.food.map((food: any) => (
            <p key={food.id}>
              {food.name} {food.calories} 
            </p>
          ))}
        </FoodSection>
        

      </div>    
      
      <div className='right side'>
        <button disabled={isCurrentDay} onClick={(e) => {
          e.preventDefault
          const newDate = new Date()
          newDate.setDate(dayDate.getDate() + 1)
          setDayDate(newDate)
          setFormattedDate(formatDate(newDate))
        }}>RT</button>
      </div>
    </ContentWindow>  
  )
}

export default App
