import { useEffect, useState } from "react"
import { firebaseAuth } from "../lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, useOutletContext } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { LoginStyle } from "../styles/LoginStyle"

interface LoginInfo {
  email: string,
  password: string
}

export function Login() {
  const navigate = useNavigate()
  const {loggedIn, verified, isLoadingInitial} = useOutletContext<{
    loggedIn: boolean,
    verified: boolean,
    isLoadingInitial: boolean
  }>()

  // Redirects
  useEffect(() => {
    if (!isLoadingInitial) {
      if (loggedIn) {
        if (!verified) {
          navigate('/verify')
        } else {
          navigate('/')
        }
      }
    }
    
  }, [verified, loggedIn])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loginMutation = useMutation({
    mutationFn: async (loginInfo: LoginInfo) => {
      setIsLoading(true)
      await signInWithEmailAndPassword(firebaseAuth, loginInfo.email, loginInfo.password)
    },
    onSuccess() {
      console.log("User signed in")
    },
    onError(error) {
      setIsError(true)
      setErrorMessage(error.message)
    }
  })

  return (
    <LoginStyle>
        <h1>Login</h1>
        <form onSubmit={e => {
          e.preventDefault()
          loginMutation.mutate({email, password})
        }}>
          <label htmlFor="email">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)}/><br/>
          <input value={password} type="password" onChange={e=>setPassword(e.target.value)}/><br/>
          <button type="submit">Login</button>
        </form>
        Don't have an account?<br/>
        <NavLink to="/signup">Sign up</NavLink>
        {isLoading ? <>Loading</> : <></>}
        {isError ? <p>{errorMessage}</p> : <></>}
    </LoginStyle>
  )
}
  