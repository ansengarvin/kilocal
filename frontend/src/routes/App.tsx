import styled from "@emotion/styled";
import { useOutletContext } from "react-router-dom";

const AppPage = styled.div`
  display: flex;
  justify-content: center;
`

const AppWindow = styled.div`
  background-color: #ffa4a4;
  width: 750px;
  height: 750px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
`

function App() {
  const {loggedIn} = useOutletContext<{loggedIn: boolean}>()

  const currentDate = new Date();
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1
  const day = currentDate.getDate()
  const formattedDate = `${year}-${month}-${day}`

  return (
    <AppPage>
      <AppWindow>
        <h1>Kilocal App</h1>
        {loggedIn ? <>{formattedDate}</> : <>Not Logged In</>}
      </AppWindow>  
    </AppPage>
  )
}

export default App
