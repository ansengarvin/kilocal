import { ContentWindow } from "../styles/ContentWindow";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { userDispatch } from "../redux/userSlice";

const SignOutButton = styled.button`
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    height: 35px;
    border-radius: 10px;
    background-color: black;
    color: white;
    width: 50%;
    background-color: ${(props) => props.theme.colors.primary};
    cursor: pointer;
`;

function Profile() {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();

    return (
        <ContentWindow>
            <ProfileStyle>
                {!user.isSyncing && (
                    <>
                        <h1>Your Profile</h1>
                        <p>Email: {user.email}</p>
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
            </ProfileStyle>
        </ContentWindow>
    );
}

const ProfileStyle = styled.div`
    background-color: ${(props) => props.theme.colors.surface};
    padding-top: 10px;
    padding-bottom: 50px;
    margin-top: 50px;
    border-radius: 10px;

    width: 350px;
    max-width: 90%;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

export default Profile;
