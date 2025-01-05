import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useOutletContext } from "react-router-dom"
import { ContentWindow } from "../components/global/ContentWindow"
import styled from "@emotion/styled"
import { firebaseAuth } from "../lib/firebase"
import { sendEmailVerification } from "firebase/auth"
import { useState } from "react"

const SignOutButton = styled.button`
  margin-top: auto;
  width: 80%;
  height: 50px;
`

function Verify() {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const {loggedIn} = useOutletContext<{loggedIn: boolean}>()
  const [resent, setResent] = useState(false)
  const [isError, setIsError] = useState(false)

  const {isLoading, error, data} = useQuery({
    queryKey: ["user"],
    enabled: (loggedIn ? true : false),
    queryFn: async () => {
      const token = await firebaseAuth.currentUser?.getIdToken()
      const url = "http://localhost:8000/users/"
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + token
        } 
      })
      return response.json()
    }
  })

  const resendMutation = useMutation({
    mutationFn: async () => {
        const user = firebaseAuth.currentUser
        user && await sendEmailVerification(user)
    },
    onSuccess() {
        setResent(true)
    },
    onError() {
        setIsError(true)
    }
  })

  return (
    <ContentWindow>
      <div className="content">
        {isLoading ? <>Loading</> : <></>}
        {error ? <>Error</> : <></>}
        {data &&
          <>
            <h1>
            Welcome, {data.name}!
            </h1>  
          </>
        }
        You aren't verified yet. Please check your email for a verification link.
        <SignOutButton onClick={(e) => {
            e.preventDefault
            resendMutation.reset()
            resendMutation.mutate()
            setResent(false)
            setIsError(true)
        }}>
            Resend
        </SignOutButton>
        <SignOutButton onClick={(e) => {
          e.preventDefault
          queryClient.clear()
          // Sign user out of firebase
          firebaseAuth.signOut()
          // Navigate to login page
          navigate("/login")
        }}>
          Sign Out
        </SignOutButton>
        {isError ? <p>Error sending verification email</p> : <></>}
        {resent ? <p>Verification email resent</p> : <></>}
      </div>  
    </ContentWindow>
  )
}
  
export default Verify
  