import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { LoginStyle } from "../components/styles/LoginStyle";
import { ProgressBarText } from "../components/data/ProgressBar";
import { RootState, useAppDispatch } from "../redux/store";
import { userDispatch } from "../redux/userSlice";
import { useSelector } from "react-redux";

export function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user);
    const { isLoadingInitial } = useOutletContext<{
        isLoadingInitial: boolean;
    }>();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Redirects
    useEffect(() => {
        if (!isLoadingInitial && !user.isSyncing) {
            if (user.loggedIn) {
                if (!user.verified) {
                    navigate("/verify");
                } else {
                    navigate("/");
                }
            }
        }
    }, [user.verified, user.loggedIn, user.isSyncing]);

    return (
        <LoginStyle>
            <h1>Login</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(
                        userDispatch.firebaseSignIn({
                            email: email,
                            password: password,
                        }),
                    );
                }}
            >
                <label htmlFor="email">Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={user.signInError ? "error" : ""}
                    disabled={user.isSigningIn || user.isSyncing}
                />
                <label htmlFor="password">Password</label>
                <input
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className={user.signInError ? "error" : ""}
                    disabled={user.isSigningIn || user.isSyncing}
                />
                <div className="buttonSection">
                    {!user.isSyncing && user.isSigningIn && (
                        <ProgressBarText value={0} goal={2} height="35px" width="100%" text={"Signing in..."} />
                    )}
                    {user.isSyncing && (
                        <ProgressBarText value={1} goal={2} height="35px" width="100%" text={"Signing in..."} />
                    )}
                    {!user.isSyncing && !user.isSigningIn && (
                        <button className="login" type="submit">
                            Log In
                        </button>
                    )}
                </div>
            </form>

            <span>
                Don't have an account? <NavLink to="/signup">Create an account</NavLink>
            </span>
            {user.signInError ? <span className="error">{user.signInError}</span> : <></>}
            {user.syncError ? <span className="error">{user.syncError}</span> : <></>}
        </LoginStyle>
    );
}
