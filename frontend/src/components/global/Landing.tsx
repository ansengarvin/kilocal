import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

const LandingStyle = styled.div`
    text-align: center;
`

export function Landing() {
    // get logged in status from outlet context
    return(
        <LandingStyle>
            <h1>Welcome to KiloCal!</h1>
            <p>
                This is my personal calorie counter application.
                Feel free to use it!
            </p>
            <NavLink to="/login">Login</NavLink> or <NavLink to="/signup">Sign Up</NavLink>
        </LandingStyle>
    )
        
}