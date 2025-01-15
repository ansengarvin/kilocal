import styled from "@emotion/styled"
import { mobileView } from "../../lib/defines"

export const ContentWindow = styled.div`
  width: 750px;

  background-color: pink;

  @media (max-width: ${mobileView}) {
    width: 100%;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
`