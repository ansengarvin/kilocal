import { firebaseAuth } from "../lib/firebase";
import { useEffect } from "react";
import { LoginStyle } from "../components/styles/LoginStyle";
import { RootState, useAppDispatch } from "../redux/store";
import { useSelector } from "react-redux";
import { userDispatch } from "../redux/userSlice";

function Verify() {
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user);

    // Check if user is verified on an interval; If they are,
    useEffect(() => {
        if (user.firebaseIsLoadedInitial && user.isLoggedIn && !user.isVerified) {
            const interval = setInterval(async () => {
                if (firebaseAuth.currentUser) {
                    await firebaseAuth.currentUser.reload();
                    dispatch(userDispatch.fetchUserFirebase());
                }
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [user.firebaseIsLoadedInitial, user.isLoggedIn, user.isVerified, dispatch]);

    return (
        <LoginStyle>
            <h1>Welcome to KiloCal!</h1>
            <div className="content">
                You aren't verified yet. Please check your email for a verification link.
                <div className="buttonSection">
                    <button
                        className="grey half"
                        onClick={(e) => {
                            e.preventDefault;
                            dispatch(userDispatch.resendVerificationEmail());
                        }}
                    >
                        Resend Link
                    </button>{" "}
                    or
                    <button
                        className="grey half"
                        onClick={(e) => {
                            e.preventDefault;
                            dispatch(userDispatch.firebaseSignOut());
                        }}
                    >
                        Sign Out
                    </button>
                </div>
                {user.resendVerificationStatus && <>{user.resendVerificationStatus}</>}
                {user.signOutError ? <p>Error signing out: {user.signOutError}</p> : <></>}
            </div>
            <br />
            <span>
                Account verified? <a href="/verify">Click here to refresh.</a>
            </span>
        </LoginStyle>
    );
}

export default Verify;
