import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${month}-${day}`
}

const AppPage = styled.div`
  display: flex;
  justify-content: center;
`

const AppWindow = styled.div`
  width: 750px;
  height: 750px;

  display: grid;
  grid-template-areas: "left center right";
  grid-template-columns: 50px 1fr 50px;

  div.left {
    grid-area: left;
    
  }

  div.right{
    grid-area: right;
  }

  div.side {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    button {
      height: 45px;
      width: 45px;
    }
  }

  div.content {
    background-color: #ffa4a4;
    grid-area: center;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

function App() {
  const {loggedIn} = useOutletContext<{loggedIn: boolean}>()

  const [dayDate, setDayDate] = useState(new Date())
  const [formattedDate, setFormattedDate] = useState(formatDate(dayDate))
  const [isCurrentDay, setIsCurrentDay] = useState(true)

  const {isLoading, error, data} = useQuery({
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

  return (
    <AppPage>
      <AppWindow>
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
          <h1>Kilocal App</h1>
          {loggedIn ? <>{formattedDate}</> : <>Not Logged In</>}
          {isLoading ? <>Loading</> : <></>}
          {error ? <>Error</> : <></>}
          {data && Object.keys(data).map((key) => (
            <p key={key}>
              {data[key]}
            </p>
          ))}

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
      </AppWindow>  
    </AppPage>
  )
}

export default App
