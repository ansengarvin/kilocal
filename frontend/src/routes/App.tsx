import styled from "@emotion/styled";
import { useOutletContext } from "react-router-dom";

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

    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const AppContent = styled.div``

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
        <div className='left side'>
          <button>LT</button>
        </div>

        <div className='content'>
          <h1>Kilocal App</h1>
          {loggedIn ? <>{formattedDate}</> : <>Not Logged In</>}
        </div>    
        
        <div className='right side'>
          <button>RT</button>
        </div>
      </AppWindow>  
    </AppPage>
  )
}

export default App
