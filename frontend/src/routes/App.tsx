import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import { ContentWindow } from "../components/ContentWindow";
import styled from "@emotion/styled";

const bgColor = '#adadad'

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${month}-${day}`
}

const PostSection = styled.div`
  background-color: ${bgColor};
  border-radius: 10px;
  width: 90%;
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
  background-color: ${bgColor};
  border-radius: 10px;
  height: 100%;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const FoodEntry = styled.div`
  width: 95%;
  height: 50px;

  display: grid;
  grid-template-areas:
    "foodname calories buttons";
  grid-template-columns: 12fr 4fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 10px;
  margin-top: 10px;

  div.item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  div.buttonSection {
    grid-area: buttons;
  }

  div.foodname {
    grid-area: foodname;
  }

  div.calories {
    grid-area: calories;
  }

  .textContent {
    background-color: #ffffff;
    height: 90%;
    width: 100%;
    border-radius: 10px;
    display: flex;
    justify-content: left;
    align-items: center;

    .inner {
      margin-left: 10px;
    }
  }

  
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
            <FoodEntry key={food.id}>
              <div className="item foodname">
                <div className="textContent">
                  <div className="inner">
                    {food.name}
                  </div>  
                </div>
                
              </div>
              <div className="item calories">
              <div className="textContent">
                  <div className="inner">
                    {food.calories}
                  </div>  
                </div>
              </div>
              <div className="item buttonSection">
                <button className="delete">X</button>
              </div>
            </FoodEntry>
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
