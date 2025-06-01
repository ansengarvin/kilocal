import { useMutation, useQuery } from "@tanstack/react-query";
import { ContentWindow } from "../components/styles/AppStyle";
import styled from "@emotion/styled";
import { firebaseAuth } from "../lib/firebase";
import { useState } from "react";
import { apiURL } from "../lib/defines";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const SignOutButton = styled.button`
    margin-top: auto;
    width: 80%;
    height: 50px;
`;

function Profile() {
    const user = useSelector((state: RootState) => state.user);
    const { isLoading, error, data } = useQuery({
        queryKey: ["user"],
        enabled: user.isLoggedIn ? true : false,
        queryFn: async () => {
            const token = await firebaseAuth.currentUser?.getIdToken();
            const url = `${apiURL}/users/`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            return response.json();
        },
    });

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
        <ContentWindow>
            <div className="content">
                {isLoading ? <>Loading</> : <></>}
                {error ? <>Error</> : <></>}
                {data && (
                    <>
                        <h1>Your Profile</h1>
                        <p>
                            Email: {data.email}
                            <br />
                            Weight: {data.weight}
                        </p>
                    </>
                )}
                <SignOutButton
                    onClick={(e) => {
                        e.preventDefault;
                        signOut.mutate();
                    }}
                >
                    Sign Out
                </SignOutButton>
                {signoutError ? <>{signoutErrorMessage}</> : <></>}
            </div>
        </ContentWindow>
    );
}

export default Profile;
