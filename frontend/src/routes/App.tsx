import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
  let navigate = useNavigate()

  useEffect(() => {
    if (!Cookies.get("auth")) {
      navigate('/login')
    }
  })

  return (
    <>
      Kilocal App
    </>
  )
}

export default App
