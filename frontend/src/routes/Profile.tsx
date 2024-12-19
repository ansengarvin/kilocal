import { useQueryClient } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useNavigate, useOutletContext } from "react-router-dom"

function Profile() {
  const {setLoggedIn} = useOutletContext<{setLoggedIn: Function}>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
    return (
      <>
        <button onClick={(e) => {
          e.preventDefault
          Cookies.remove("auth")
          queryClient.clear()
          setLoggedIn(false)
          navigate('/')
        }}>
          Log Out
        </button>
      </>
    )
  }
  
export default Profile
  