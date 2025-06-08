import { ContentWindow } from "../styles/ContentWindow";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { userDispatch } from "../redux/userSlice";

const SignOutButton = styled.button`
    margin-top: auto;
    width: 80%;
    height: 50px;
`;

function Profile() {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();

    return (
        <ContentWindow>
            <div className="content">
                {!user.isSyncing && (
                    <>
                        <h1>{user.name}'s Profile</h1>
                        <p>
                            Email: {user.email}
                            <br />
                            Weight: {user.weight}
                        </p>
                    </>
                )}
                <SignOutButton
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(userDispatch.firebaseSignOut());
                    }}
                >
                    Sign Out
                </SignOutButton>
                {user.signOutError && <>{user.signOutError}</>}
            </div>
        </ContentWindow>
    );
}

export default Profile;
