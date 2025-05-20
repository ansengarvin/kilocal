import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { firebaseAuth } from "../lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate, useOutletContext } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { LoginStyle } from "../components/styles/LoginStyle";
import { apiURL } from "../lib/defines";
import { ProgressBarText } from "../components/data/ProgressBar";
//import { useNavigate } from "react-router-dom";

interface UserInfo {
    email: string;
    password: string;
    name: string;
}

export function Signup() {
    const { verified, loggedIn, isLoadingInitial } = useOutletContext<{
        loggedIn: boolean;
        verified: boolean;
        isLoadingInitial: boolean;
    }>();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [weight, setWeight] = useState(0);

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const [stage, setStage] = useState(0);
    const [stageName, setStageName] = useState("");

    const signUpMutation = useMutation({
        mutationFn: async (userInfo: UserInfo) => {
            setStage(0);
            setStageName("Creating user account");
            const userCredentials = await createUserWithEmailAndPassword(
                firebaseAuth,
                userInfo.email,
                userInfo.password,
            );
            setStage(1);
            setStageName("Sending verification email");
            const user = userCredentials.user;
            await sendEmailVerification(user);
            const token = await user.getIdToken();
            setStage(2);
            setStageName("Setting up profile");
            var retries = 0;
            while (retries < 3) {
                try {
                    const url = `${apiURL}/users`;
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer " + token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: userInfo.name,
                            weight: weight,
                        }),
                    });
                    // Make sure response is successful
                    if (!response.ok) {
                        const errorResposne = await response.json();
                        throw new Error(errorResposne.err);
                    }

                    return response.json();
                } catch (error) {
                    retries++;
                }
            }
            // Out of retries. Sign the user out, return error.
            // When the user logs in again, the API server will try to create the account again.
            await firebaseAuth.signOut();
            throw new Error(
                `Error: Account creation was successful, but there was a server error. Please try to log in later.`,
            );
        },
        onSuccess: () => {
            navigate("/verify");
        },
        onError: (error) => {
            setErrorMessage(error.message);
        },
        onSettled: () => {
            // Clear the form fields
            setEmail("");
            setPassword("");
            setName("");
            setWeight(0);
        },
    });

    // Redirects
    useEffect(() => {
        if (!signUpMutation.isPending && !isLoadingInitial) {
            if (loggedIn) {
                if (verified) {
                    navigate("/profile");
                } else {
                    navigate("/verify");
                }
            }
        }
    }, [verified, loggedIn, signUpMutation.isPending]);

    return (
        <LoginStyle>
            <h1>Create an Account</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // Confirm password
                    signUpMutation.reset();
                    if (password !== confirmPassword) {
                        setPasswordsMatch(false);
                        return;
                    }
                    signUpMutation.mutate({ email, password, name });
                }}
            >
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={signUpMutation.isPending}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={signUpMutation.isPending}
                />
                <label htmlFor="confirm" className={!passwordsMatch ? "error" : ""}>
                    Confirm Password
                </label>
                <input
                    className={!passwordsMatch ? "error" : ""}
                    type="password"
                    id="confirm"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                    required
                    disabled={signUpMutation.isPending}
                />
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={signUpMutation.isPending}
                />
                <div className="buttonSection">
                    {signUpMutation.isPending ? (
                        <ProgressBarText value={stage} goal={3} height="35px" width="100%" text={stageName} />
                    ) : (
                        <button
                            className={signUpMutation.isPending ? "signup loading" : "signup"}
                            type="submit"
                            disabled={signUpMutation.isPending}
                        >
                            {signUpMutation.isPending ? "Loading" : "Sign Up"}
                        </button>
                    )}
                </div>
            </form>

            <span>
                Already have an account? <NavLink to="/login">Log In</NavLink>
            </span>
            {signUpMutation.isError && <span className="error">{errorMessage}</span>}
            {!passwordsMatch && <span className="error">Error: Passwords must match</span>}
        </LoginStyle>
    );
}
