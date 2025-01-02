import styled from "@emotion/styled"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Cookies from "js-cookie"

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

  const [loginButtonPressed, setLoginButtonPressed] = useState(false)

  const {isLoading, error, data} = useQuery({
    enabled: (loginButtonPressed ? true : false),
    queryKey: ["login", email, password],
    queryFn: async () => {
      const url = "http://localhost:8000/users/login"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      setLoginButtonPressed(false)
      const body = await response.json()
      
      // Set authentication token into cookie and set logged in to true
      if (body["token"]) {
        Cookies.set("auth", body["token"])
        return {"token": "recieved"}
      }
      
      // Show whatever error the API server produced
      else {
        return response.json()
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
            Email <input value={email} onChange={e=>setEmail(e.target.value)} disabled={isLoading}/><br/>
            Password <input value={password} type="password" onChange={e=>setPassword(e.target.value)} disabled={isLoading}/><br/>

            <button type="submit">Login</button>
          </form>
          Information<br/>
          {isLoading && <>Loading.</>}
          {error && <>Error: {error.message}</> }
          {data && Object.keys(data).map((key) => (
            <p key={key}>
              {data[key]}
            </p>
          ))}
        </div>
      </LoginStyle>
    )
}
  