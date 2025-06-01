import { useMutation } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { firebaseAuth } from "../lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { LoginStyle } from "../components/styles/LoginStyle";
import { RootState, useAppDispatch } from "../redux/store";
import { useSelector } from "react-redux";
import { userDispatch } from "../redux/userSlice";

function Verify() {
    const [resent, setResent] = useState(false);
    const [isError, setIsError] = useState(false);

    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user);

    // useEffect(() => {
    //     if (!isLoadingInitial && user.isLoggedIn && !user.isVerified) {
    //         const interval = setInterval(async () => {
    //             if (firebaseAuth.currentUser) {
    //                 await firebaseAuth.currentUser.reload();
    //                 dispatch(userDispatch.fetchUser());
    //             }
    //             console.log("Interval");
    //         }, 5000);

    //         return () => clearInterval(interval);
    //     }
    // }, [isLoadingInitial, user.isLoggedIn, user.isVerified, dispatch]);

    // Resends email verification
    const resendMutation = useMutation({
        mutationFn: async () => {
            const user = firebaseAuth.currentUser;
            user && (await sendEmailVerification(user));
        },
        onSuccess() {
            setResent(true);
        },
        onError() {
            setIsError(true);
        },
    });

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
                            resendMutation.reset();
                            resendMutation.mutate();
                            setResent(false);
                            setIsError(true);
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
                {isError ? <p>Error sending verification email</p> : <></>}
                {resent ? <p>Verification email resent</p> : <></>}
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
