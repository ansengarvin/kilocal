import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LoginStyle } from "../components/styles/LoginStyle";
import { ProgressBarText } from "../components/data/ProgressBar";
import { RootState, useAppDispatch } from "../redux/store";
import { userDispatch } from "../redux/userSlice";
import { useSelector } from "react-redux";
//import { useNavigate } from "react-router-dom";

export function Signup() {
    const dispatch = useAppDispatch();
    const isSigningUp = useSelector((state: RootState) => state.user.isSigningUp);
    const signUpError = useSelector((state: RootState) => state.user.signUpError);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    return (
        <LoginStyle>
            <h1>Create an Account</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // Confirm password
                    if (password !== confirmPassword) {
                        setPasswordsMatch(false);
                    } else {
                        dispatch(userDispatch.firebaseSignUp({ email, password, name }));
                    }
                }}
            >
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSigningUp}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSigningUp}
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
                    disabled={isSigningUp}
                />
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSigningUp}
                />
                <div className="buttonSection">
                    {isSigningUp ? (
                        <ProgressBarText value={0} goal={1} height="35px" width="100%" text={"Signing Up..."} />
                    ) : (
                        <button
                            className={isSigningUp ? "signup loading" : "signup"}
                            type="submit"
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? "Loading" : "Sign Up"}
                        </button>
                    )}
                </div>
            </form>

            <span>
                Already have an account? <NavLink to="/login">Log In</NavLink>
            </span>
            {signUpError && <span className="error">{signUpError}</span>}
            {!passwordsMatch && <span className="error">Error: Passwords must match</span>}
        </LoginStyle>
    );
}
