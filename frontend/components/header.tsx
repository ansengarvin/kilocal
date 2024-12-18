import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";

const Headerbar = styled.nav`
    background-color: grey;
    height: 100px;
    grid-area: header;
    display: flex;
`

export function Header() {
    return (
        <Headerbar>
            <NavLink to="/">Ansen Garvin</NavLink>
        </Headerbar>
    )
}