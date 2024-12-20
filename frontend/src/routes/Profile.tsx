import { useQuery, useQueryClient } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useNavigate, useOutletContext } from "react-router-dom"
import { ContentWindow } from "../components/ContentWindow"
import styled from "@emotion/styled"

const SignOutButton = styled.button`
  margin-top: auto;
  width: 80%;
  height: 50px;
`

function Profile() {
  const {setLoggedIn} = useOutletContext<{setLoggedIn: Function}>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {isLoading, error, data} = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const url = "http://localhost:8000/users/"
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + Cookies.get("auth")
        } 
      })
      return response.json()
    }
  })

  return (
    <ContentWindow>
      <div className="content">
        {isLoading ? <>Loading</> : <></>}
        {error ? <>Error</> : <></>}
        {data &&
          <>
          <h1>
          {data.name}'s Profile
          </h1>
          <p>
            Email: {data.email}<br/>
            Weight: {data.weight}
          </p>
            
          </>
        }
        <SignOutButton onClick={(e) => {
          e.preventDefault
          Cookies.remove("auth")
          queryClient.clear()
          setLoggedIn(false)
          navigate('/')
        }}>
          Sign Out
        </SignOutButton>
      </div>  
    </ContentWindow>
  )
}
  
export default Profile
  