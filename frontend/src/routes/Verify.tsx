import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate, useOutletContext } from "react-router-dom"
import { ContentWindow } from "../components/global/ContentWindow"
import styled from "@emotion/styled"
import { firebaseAuth } from "../lib/firebase"
import { sendEmailVerification } from "firebase/auth"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

const SignOutButton = styled.button`
  margin-top: auto;
  width: 80%;
  height: 50px;
`

function Verify() {
    const navigate = useNavigate()

    const {loggedIn, verified} = useOutletContext<{
        loggedIn: boolean,
        verified: boolean
    }>()
    const [resent, setResent] = useState(false)
    const [isError, setIsError] = useState(false)

    // Redirects
    useEffect(() => {
        if (loggedIn) {
            if (!verified) {
              navigate('/verify')
            } else {
              navigate('/profile')
            }
        } else {
            navigate('/')
        }
    }, [verified, loggedIn])

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

    // Resends email verification
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

    // Signs user out
    const [signoutError, setSignoutError] = useState(false)
    const [signoutErrorMessage, setSignoutErrorMessage] = useState('')
    const signOut = useMutation({
    mutationFn: async () => {
      await firebaseAuth.signOut()
    },
    onSuccess() {
      console.log("User signed out")
    },
    onError(error) {
      setSignoutError(true)
      setSignoutErrorMessage(error.message)
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
          signOut.mutate()
        }}>
          Sign Out
        </SignOutButton>
        {isError ? <p>Error sending verification email</p> : <></>}
        {resent ? <p>Verification email resent</p> : <></>}
        {signoutError ? <p>Error signing out: {signoutErrorMessage}</p> : <></>}
        <NavLink to="/verify">Refresh</NavLink>
      </div>  
    </ContentWindow>
  )
}
  
export default Verify
  