import { useState } from "react";
import { firebaseAuth } from "../lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
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
