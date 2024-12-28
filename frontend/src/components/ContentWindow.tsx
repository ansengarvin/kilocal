import styled from "@emotion/styled"

export const ContentWindow = styled.div`
  width: 750px;
  height: 700px;

  display: grid;
  grid-template-areas: "left center right";
  grid-template-columns: 50px 1fr 50px;

  div.left {
    grid-area: left;
  }

  div.right{
    grid-area: right;
  }

  div.side {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    
    button {
      height: 45px;
      width: 45px;
    }
  }

  div.content {
    grid-area: center;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
  }
`