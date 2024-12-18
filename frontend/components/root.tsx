import * as React from "react"
import styled from '@emotion/styled'
import { Header } from "./header"
import App from "../src/App"
import { Outlet } from "react-router-dom"

interface RootProps {
    children?: React.ReactNode
}

const Grid = styled.div`
    display: grid;
    grid-template-areas:
        "header header header"
        "leftgutter main rightgutter"
        "footer footer footer";
    grid-template-columns: 100px 1fr 100px;
    grid-template-rows: auto 1fr auto;
    row-gap: 15px;
    width: 100vw;
    height: 100vh;
    background-color: green;
`

const Main = styled.main`
    grid-area: main;
    background-color: #8000807d;
`


export function Root(props: RootProps) {
    const {children} = props

    return (
        <Grid>
            <Header/>
            <Main>
                {children || <Outlet/>}
            </Main>
        </Grid>
    )
}