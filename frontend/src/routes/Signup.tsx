import styled from "@emotion/styled";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { firebaseAuth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
//import { useNavigate } from "react-router-dom";

const SignupStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

interface UserInfo {
    email: string,
    password: string,
    name: string
}

export function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [weight, setWeight] = useState(0)

    const [isSuccess, setIsSuccess] = useState(false)

    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const signUpMutation = useMutation({
        mutationFn: async (userInfo: UserInfo) => {
            const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, userInfo.email, userInfo.password)
            const user = userCredentials.user
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
            return response.json()
        },
        onSuccess: () => {
            setIsSuccess(true)
            //navigate('/welcome')
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
    // const signUpQuery = useQuery({
    //     enabled: (queryEnabled && queryEmail && queryPassword && queryName ? true : false),
    //     queryKey: ['signUpQuery', queryEmail, queryPassword, queryName],
    //     queryFn: async () => {
    //         // Store user info in request body and clear all fields
    //         // Sign user in and await email verification
    //         console.log("Creating user with email and password")
    //         const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, queryEmail, queryPassword)
    //         const user = userCredentials.user
    //         console.log("Sending email verification")
    //         await sendEmailVerification(user)

    //         // Get token
    //         const token = await user.getIdToken()
            
    //         // Insert user into database
    //         console.log("Posting user to DB")
    //         const url = 'http://localhost:8000/users'
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': 'Bearer ' + token,
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 name: queryName,
    //                 weight: weight
    //             })
    //         })
    //         console.log("Done!")
    //         setQueryEnabled(false)
    //         return response.json()
    //     }
    // })
    return (
        <SignupStyle>
            <form onSubmit={(e) => {
                e.preventDefault()
                signUpMutation.reset()
                setIsSuccess(false)
                setIsError(false)
                signUpMutation.mutate({email, password, name})
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
            {isSuccess && <p>Success!</p>}
            {isError && <p>{errorMessage}</p>}
        </SignupStyle>      
    )
}