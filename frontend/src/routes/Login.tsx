import styled from "@emotion/styled"
import { useEffect, useState } from "react"
import { firebaseAuth } from "../lib/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { useQuery } from "@tanstack/react-query"

const LoginStyle = styled.div `
    height: 500px;
    width: 400px;
    background-color: #dadada;
    border-radius: 10px;
    padding-top: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
`

export function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [firebaseUserInfo, setFireBaseUserInfo] = useState(firebaseAuth.currentUser)
  useEffect(() => onAuthStateChanged(firebaseAuth, setFireBaseUserInfo), [])

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
      return response
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
        Information<br/>
        {firebaseUserInfo?.uid || <>No UID yet</>}<br/>
        {isLoading && <>Loading.</>}
        {error && <>Error: {error.message}</> }
      </div>
    </LoginStyle>
  )
}
  