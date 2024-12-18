import styled from "@emotion/styled"

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
    flex-direction: row;
    justify-content: center;

  }
`

function LoginModal() {
    return (
      <LoginWindow>
        <div>
          Login
        </div>
        
      </LoginWindow>
    )
  }
  
export default LoginModal
  