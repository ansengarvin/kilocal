import styled from "@emotion/styled";
import { tabletView } from "../lib/defines";

/**
 * General style used to provide consistent width and alignment throughout the app.
 */
export const ContentWindow = styled.div`
    width: 750px;

    @media (max-width: ${tabletView}) {
        width: 100%;
    }

    display: flex;
    flex-direction: column;
    align-items: center;
`;
