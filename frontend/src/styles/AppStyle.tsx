import styled from "@emotion/styled";
import { tabletView } from "../lib/defines";

export const ContentWindow = styled.div`
    width: 750px;

    @media (max-width: ${tabletView}) {
        width: 100%;
    }

    display: flex;
    flex-direction: column;
    align-items: center;
`;
