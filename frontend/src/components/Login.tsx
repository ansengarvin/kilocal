import styled from "@emotion/styled"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

const LoginWindow = styled.div `
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: #0000005a;

  display: flex;
  justify-content: center;
  align-items: center;

  div {
    height: 500px;
    width: 400px;
    background-color: white;
    border-radius: 10px;
    padding-top: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;

  }
`

function LoginModal() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [loginButtonPressed, setLoginButtonPressed] = useState(false)

  const {isLoading, error, data} = useQuery({
    enabled: (loginButtonPressed ? true : false),
    queryKey: ["login", username, password],
    queryFn: async () => {
      const url = "http://localhost:8000/users/login"
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      return response.type
    }
  })

    return (
      <LoginWindow>
        <div>
          Login<br/>

          <form onSubmit={e => {
            e.preventDefault()
            setLoginButtonPressed(true)
          }}>
            Username <input value={username} onChange={e=>setUsername(e.target.value)}/><br/>
            Password: <input value={password} type="password" onChange={e=>setPassword(e.target.value)}/><br/>

            <button type="submit">Login</button>
          </form>
          Information<br/>
          {isLoading && <>Loading.</>}
          {error && <>Error: {error.message}</> }
          {data && <>{data}</>}
        </div>
      </LoginWindow>
    )
  }
  
export default LoginModal
  