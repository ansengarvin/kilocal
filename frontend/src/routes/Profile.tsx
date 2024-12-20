import { useQueryClient } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useNavigate, useOutletContext } from "react-router-dom"
import { ContentWindow } from "../components/contentwindow"
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
    return (
      <ContentWindow>
        <div className="content">
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
  