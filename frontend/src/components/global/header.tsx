import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import { ReactNode } from "react";

interface HeaderProps {
    bgColor: string
    height: string
    children?: ReactNode
}

const Headerbar = styled.nav<{color: string, height: string}>`
    background-color: ${(props)=> props.color};
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: right;
    height: ${(props)=> props.height};
    padding-left: 100px;
    padding-right: 100px;

    a {
        color: white;
        text-decoration: none;
        height: 20px;
    }
    a.title {
        margin-right: auto;
    }

    a.navItem{}
`

export function Header(props: HeaderProps) {
    const {bgColor, height} = props
    return (
        <Headerbar color={bgColor} height={height}>
            <NavLink className="title" to="/" aria-label="Home">KiloCal</NavLink>
            <NavLink className="navitem" to="/profile" aria-label="Login">Profile</NavLink>
        </Headerbar>
    )
}