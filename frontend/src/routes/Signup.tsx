import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { firebaseAuth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignupStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export function Signup() {
    const [buttonPressed, setButtonPressed] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signUpQuery = useQuery({
        enabled: buttonPressed,
        queryKey: ['signUpQuery'],
        queryFn: async () => {
            const inputEmail = email
            const inputPassword = password

            // Clear fields in case of failure
            setEmail('')
            setPassword('')
            setButtonPressed(false)

            const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, inputEmail, inputPassword)
            const user = userCredentials.user

            const token = await user.getIdToken()
            const url = `http://localhost:8000/users/`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    name: "Test Name",
                    weight: 100
                })
            })

            return response.json()
        }
    })
    return (
        <SignupStyle>
            <form onSubmit={(e) => {
                e.preventDefault()
                setButtonPressed(true)
            }}>
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
                <button type="submit">
                    Submit
                </button>
            </form>
            {signUpQuery.isLoading && <p>Loading...</p>}
            {signUpQuery.data?.id && <p>Signed up!</p>}
            {signUpQuery.error && <p>Error: {signUpQuery.error.message}</p>}
        </SignupStyle>      
    )
}