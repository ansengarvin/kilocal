import styled from "@emotion/styled"
import { useEffect, useState } from "react"
import { firebaseAuth } from "../lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useOutletContext } from "react-router-dom"

const LoginStyle = styled.div `
    height: 500px;
    width: 400px;
    background-color: #dadada;
    border-radius: 10px;
    padding-top: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;
`

export function Login() {
  const navigate = useNavigate()
  const {loggedIn, verified} = useOutletContext<{
    loggedIn: boolean,
    verified: boolean
  }>()

  // Redirects
  useEffect(() => {
    if (loggedIn) {
        if (!verified) {
          navigate('/verify')
        } else {
          navigate('/profile')
        }
    }
}, [verified, loggedIn])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginButtonPressed, setLoginButtonPressed] = useState(false)

  const {isLoading, error} = useQuery({
    enabled: (loginButtonPressed ? true : false),
    queryKey: ["login", email, password],
    queryFn: async () => {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      // Get token
      const token = await userCredential.user.getIdToken()

      const url = "http://localhost:8000/users/login"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      setLoginButtonPressed(false)

      // If the response is good, redirect to main page
      if (response.ok) {
        window.location.href = "/"
      } else {
        console.log("Login failed")
      }
    }
  })

  return (
    <LoginStyle>
      <div>
        <h1>Login</h1>
        <form onSubmit={e => {
          e.preventDefault()
          setLoginButtonPressed(true)
        }}>
          Email <input value={email} onChange={e=>setEmail(e.target.value)}/><br/>
          Password <input value={password} type="password" onChange={e=>setPassword(e.target.value)}/><br/>
          <button type="submit">Login</button>
        </form>
        Don't have an account?<br/>
        <a href="/signup">Sign Up</a>
      </div>
      {isLoading ? <>Loading</> : <></>}
      {error ? <>Error: {error.message}</> : <></>}
    </LoginStyle>
  )
}
  