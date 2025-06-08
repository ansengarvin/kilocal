import styled from "@emotion/styled";

/**
 * General style used to provide consistent width and alignment throughout the app.
 */
export const ContentWindow = styled.div`
    width: 750px;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        width: 100%;
    }

    display: flex;
    flex-direction: column;
    align-items: center;
`;
