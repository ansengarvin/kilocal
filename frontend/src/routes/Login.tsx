import { useEffect, useState } from "react"
import { firebaseAuth } from "../lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, useOutletContext } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { LoginStyle } from "../components/styles/LoginStyle"

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
    const [credentialError, setCredentialError] = useState(false)

    const loginMutation = useMutation({
        mutationFn: async (loginInfo: LoginInfo) => {
            setIsLoading(true)
            await signInWithEmailAndPassword(firebaseAuth, loginInfo.email, loginInfo.password)
        },
        onSuccess() {
            console.log("User signed in")
        },
        onError(error: any) {
            setIsError(true)
            if (error.name == "FirebaseError") {
                if (error.code == "auth/invalid-credential") {
                    setCredentialError(true)
                    setErrorMessage("Invalid username or password")
                } else if (error.code == "auth/too-many-requests") {
                    setErrorMessage("Too many requests. Try again later.")
                } else {
                    setErrorMessage(error.message)
                }
            } else {
                setErrorMessage(error.message)
            } 
        },
        onSettled() {
            setIsLoading(false)
        }
    })

    return (
        <LoginStyle width={'700px'}>
            <h1>Login</h1>

            <form onSubmit={e => {
                e.preventDefault()
                setCredentialError(false)
                loginMutation.mutate({email, password})
            }}>
                <label htmlFor="email">
                    Email
                </label>
                <input
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    className={credentialError ? 'error' : ''}
                />
                <label htmlFor="password">
                    Password
                </label>
                <input
                    value={password}
                    type="password"
                    onChange={e=>setPassword(e.target.value)}
                    className={credentialError ? 'error' : ''}
                />
                <div className="buttonSection">
                    <button className="login" type="submit">
                        Log In
                    </button>
                </div> 
            </form>

            <span>
                Don't have an account? <NavLink to="/signup">Create an account</NavLink>
            </span>
            {isLoading ? <>Loading</> : <></>}
            {isError ? <span className='error'>{errorMessage}</span> : <></>}
        </LoginStyle>
    )
}