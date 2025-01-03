import styled from "@emotion/styled";

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
            <a href="/login">Login</a> or <a href="/signup">Sign Up</a>
        </LandingStyle>
    )
        
}