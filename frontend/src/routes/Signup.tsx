import styled from "@emotion/styled";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { firebaseAuth } from "../lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate, useOutletContext } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { LoginStyle } from "../styles/LoginStyle";
//import { useNavigate } from "react-router-dom";

interface UserInfo {
    email: string,
    password: string,
    name: string
}

export function Signup() {

    const {verified, loggedIn, isLoadingInitial} = useOutletContext<{
        loggedIn: boolean,
        verified: boolean,
        isLoadingInitial: boolean
    }>()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [weight, setWeight] = useState(0)

    const [passwordsMatch, setPasswordsMatch] = useState(true)

    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    // Redirects
    useEffect(() => {
        if (!isPosting && !isLoadingInitial) {
            if (loggedIn) {
                if (verified) {
                    navigate('/profile')
                } else {
                    navigate('/verify')
                }
            }
        }
    }, [verified, loggedIn, isPosting])

    const signUpMutation = useMutation({
        mutationFn: async (userInfo: UserInfo) => {
            setIsPosting(true)
            const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, userInfo.email, userInfo.password)
            const user = userCredentials.user
            await sendEmailVerification(user)
            const token = await user.getIdToken()
            const url = 'http://localhost:8000/users'
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userInfo.name,
                    weight: weight
                })
            })
            setIsPosting(false)
            return response.json()
        },
        onSuccess: () => {
            setIsSuccess(true)
            navigate('/verify')
        },
        onError: (error) => {
            setIsError(true)
            setErrorMessage(error.message)
        },
        onSettled: () => {
            // Clear the form fields
            setEmail('')
            setPassword('')
            setName('')
            setWeight(0)
        }
    })

    return (
        <LoginStyle>
            <form onSubmit={(e) => {
                e.preventDefault()
                // Confirm password
                signUpMutation.reset()
                if (password !== confirmPassword) {
                    setPasswordsMatch(false)
                    return
                }
                setIsSuccess(false)
                setIsError(false)
                signUpMutation.mutate({email, password, name})
            }}>
                <h1>Signup</h1>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <br/>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <br/>
                <label htmlFor="confirm">Confirm Password</label>
                <input
                    type="password"
                    id="confirm"
                    value={confirmPassword}
                    onChange={e => {
                        setConfirmPassword(e.target.value)
                    }}
                    required
                />

                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <br/>
                <button type="submit">
                    Submit
                </button>
            </form>
            Already have an account?<br/>
            <NavLink to="/login">Go to Login</NavLink>
            {isSuccess && <p>Success!</p>}
            {isError && <p>{errorMessage}</p>}
            {!passwordsMatch && <p>Passwords do not match</p>}
        </LoginStyle>      
    )
}