import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import { appAccentColor, tabletView } from "../../lib/defines";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { userDispatch } from "../../redux/userSlice";

export function Header() {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const isVerified = useSelector((state: RootState) => state.user.isVerified);
    const dispatch = useAppDispatch();

    return (
        <Headerbar>
            {!isLoggedIn && (
                <>
                    <NavLink className="title" to="/" aria-label="Home">
                        KiloCal
                    </NavLink>
                    <NavLink className="navitem" to="/login" aria-label="Login">
                        Login
                    </NavLink>
                </>
            )}
            {isLoggedIn && !isVerified && (
                <>
                    <NavLink className="title" to="/verify" aria-label="Home">
                        KiloCal
                    </NavLink>
                    <a
                        className="navitem"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(userDispatch.firebaseSignOut());
                        }}
                    >
                        Logout
                    </a>
                </>
            )}
            {isLoggedIn && isVerified && (
                <>
                    <NavLink className="title" to="/" aria-label="Home">
                        KiloCal
                    </NavLink>
                    <NavLink className="navitem" to="/profile" aria-label="Profile">
                        Profile
                    </NavLink>
                </>
            )}
        </Headerbar>
    );
}

const Headerbar = styled.nav`
    background-color: ${appAccentColor};
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: right;
    gap: 20px;
    height: 50px;

    padding-left: 100px;
    padding-right: 100px;

    @media (max-width: ${tabletView}) {
        padding-left: 10px;
        padding-right: 10px;
    }

    a {
        color: white;
        text-decoration: none;
        height: 20px;
        cursor: pointer;
    }
    a.active {
        text-decoration: underline;
    }
    a.title {
        margin-right: auto;
        text-decoration: none;
    }
    a.navItem {
    }
`;
