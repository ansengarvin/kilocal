import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import { ReactNode } from "react";
import { appAccentColor, tabletView } from "../../lib/defines";

interface HeaderProps {
    children?: ReactNode;
    loggedIn: boolean;
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
    }
    a.title {
        margin-right: auto;
    }
    a.active {
        text-decoration: underline;
    }

    a.navItem {
    }
`;

export function Header(props: HeaderProps) {
    const { loggedIn } = props;

    return (
        <Headerbar>
            {loggedIn ? (
                <>
                    <NavLink className="title" to="/" aria-label="Home">
                        KiloCal
                    </NavLink>
                    <NavLink className="navitem" to="/profile" aria-label="Profile">
                        Profile
                    </NavLink>
                </>
            ) : (
                <>
                    <NavLink className="title" to="/" aria-label="Home">
                        KiloCal
                    </NavLink>
                    <NavLink className="navitem" to="/login" aria-label="Login">
                        Login
                    </NavLink>
                </>
            )}
        </Headerbar>
    );
}
