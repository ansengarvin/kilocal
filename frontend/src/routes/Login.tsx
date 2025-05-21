import { useEffect, useState } from "react";
import { firebaseAuth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { LoginStyle } from "../components/styles/LoginStyle";
import { apiURL } from "../lib/defines";
import { ProgressBarText } from "../components/data/ProgressBar";

interface LoginInfo {
    email: string;
    password: string;
}

export function Login() {
    const navigate = useNavigate();
    const { loggedIn, verified, isLoadingInitial } = useOutletContext<{
        loggedIn: boolean;
        verified: boolean;
        isLoadingInitial: boolean;
    }>();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [credentialError, setCredentialError] = useState(false);

    const [stage, setStage] = useState(0);
    const [stageName, setStageName] = useState("");

    const loginMutation = useMutation({
        mutationFn: async (loginInfo: LoginInfo) => {
            setStage(0);
            setStageName("Signing In");
            await signInWithEmailAndPassword(firebaseAuth, loginInfo.email, loginInfo.password);
            // Log into our backend (e.g. create database if none exists)
            console.log("Create account if none exists");
            const token = await firebaseAuth.currentUser?.getIdToken();

            setStage(1);
            setStageName("Syncing data");

            var retries = 0;
            while (retries < 3) {
                try {
                    const url = `${apiURL}/users/login`;
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                    });
                    // Throw error if response not ok
                    if (!response.ok) {
                        const responseMessage = await response.json();
                        throw new Error(responseMessage.err);
                    }
                    break;
                } catch (error) {
                    retries++;
                    if (retries == 3) {
                        // Sign user out
                        await firebaseAuth.signOut();
                        throw new Error("Failed to sign into API server. Try again later.");
                    }
                }
            }
        },
        onSuccess() {
            console.log("User signed in");
        },
        onError(error: any) {
            if (error.name == "FirebaseError") {
                if (error.code == "auth/invalid-credential") {
                    setCredentialError(true);
                    setErrorMessage("Invalid username or password");
                } else if (error.code == "auth/too-many-requests") {
                    setErrorMessage("Too many requests. Try again later.");
                } else {
                    setErrorMessage(error.message);
                }
            } else {
                setErrorMessage(error.message);
            }
        },
    });

    // Redirects
    useEffect(() => {
        if (!isLoadingInitial && !loginMutation.isPending) {
            if (loggedIn) {
                if (!verified) {
                    navigate("/verify");
                } else {
                    navigate("/");
                }
            }
        }
    }, [verified, loggedIn, loginMutation.isPending]);

    return (
        <LoginStyle>
            <h1>Login</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setCredentialError(false);
                    loginMutation.mutate({ email, password });
                }}
            >
                <label htmlFor="email">Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={credentialError ? "error" : ""}
                    disabled={loginMutation.isPending}
                />
                <label htmlFor="password">Password</label>
                <input
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className={credentialError ? "error" : ""}
                    disabled={loginMutation.isPending}
                />
                <div className="buttonSection">
                    {loginMutation.isPending ? (
                        <ProgressBarText value={stage} goal={2} height="35px" width="100%" text={stageName} />
                    ) : (
                        <button className="login" type="submit">
                            Log In
                        </button>
                    )}
                </div>
            </form>

            <span>
                Don't have an account? <NavLink to="/signup">Create an account</NavLink>
            </span>
            {loginMutation.isError ? <span className="error">{errorMessage}</span> : <></>}
        </LoginStyle>
    );
}
