import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
    let navigate = useNavigate()

    useEffect(() => {
        if (!Cookies.get("auth")) {
          navigate('/login')
        }
    })

    return (
      <>
        Profile
      </>
    )
  }
  
export default Profile
  