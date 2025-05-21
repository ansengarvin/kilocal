import { useMutation } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { firebaseAuth } from "../lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { LoginStyle } from "../components/styles/LoginStyle";

function Verify() {
    const navigate = useNavigate();

    const { loggedIn, verified, isLoadingInitial } = useOutletContext<{
        loggedIn: boolean;
        verified: boolean;
        isLoadingInitial: boolean;
    }>();
    const [resent, setResent] = useState(false);
    const [isError, setIsError] = useState(false);

    // Redirects
    useEffect(() => {
        if (!isLoadingInitial) {
            if (loggedIn) {
                if (!verified) {
                    navigate("/verify");
                } else {
                    navigate("/");
                }
            } else {
                navigate("/");
            }
        }
    }, [verified, loggedIn]);

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

    // Signs user out
    const [signoutError, setSignoutError] = useState(false);
    const [signoutErrorMessage, setSignoutErrorMessage] = useState("");
    const signOut = useMutation({
        mutationFn: async () => {
            await firebaseAuth.signOut();
        },
        onSuccess() {
            console.log("User signed out");
        },
        onError(error) {
            setSignoutError(true);
            setSignoutErrorMessage(error.message);
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
                            signOut.mutate();
                        }}
                    >
                        Sign Out
                    </button>
                </div>
                {isError ? <p>Error sending verification email</p> : <></>}
                {resent ? <p>Verification email resent</p> : <></>}
                {signoutError ? <p>Error signing out: {signoutErrorMessage}</p> : <></>}
            </div>
            <br />
            <span>
                Account verified? <a href="/verify">Click here to refresh.</a>
            </span>
        </LoginStyle>
    );
}

export default Verify;
