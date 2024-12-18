import {useState, ReactNode} from 'react'
import styled from '@emotion/styled'
import { Header } from "./header"
import { Outlet } from "react-router-dom"
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import LoginModal from './Login'

interface RootProps {
    children?: ReactNode
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
`

const Main = styled.main`
    grid-area: main;
`


export function Root(props: RootProps) {
    const {children} = props

    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        if (!Cookies.get("auth")) {
            setLoggedIn(false)
        } else {
            setLoggedIn(true)
        }
    })


    return (
        <>
        {
            loggedIn ?
             <></> :
             <LoginModal/>
        }
        <Grid>
            <Header bgColor = "grey" height = "100px" />
            <Main>
                {children || <Outlet/>}
            </Main>
        </Grid>
        </>
    )
}