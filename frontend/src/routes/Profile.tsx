import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ContentWindow } from "../components/global/ContentWindow"
import styled from "@emotion/styled"
import { firebaseAuth } from "../lib/firebase"

const SignOutButton = styled.button`
  margin-top: auto;
  width: 80%;
  height: 50px;
`

function Profile() {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const {isLoading, error, data} = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = await firebaseAuth.currentUser?.getIdToken()
      const url = "http://localhost:8000/users/"
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + token
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
          queryClient.clear()
          // Sign user out of firebase
          firebaseAuth.signOut()
          // Navigate to login page
          navigate("/login")
        }}>
          Sign Out
        </SignOutButton>
      </div>  
    </ContentWindow>
  )
}
  
export default Profile
  