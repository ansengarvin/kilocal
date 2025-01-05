import {useState, ReactNode, useEffect} from 'react'
import styled from '@emotion/styled'
import { Header } from './Header'
import { Footer } from './Footer'
import { Outlet, useLocation } from "react-router-dom"
import { firebaseAuth } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
//import { useQuery } from '@tanstack/react-query'

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
`

const Main = styled.main`
    grid-area: main;
    display: flex;
    flex-direction: column;
    align-items: center;
`


export function Root(props: RootProps) {
    const {children} = props

    const [loggedIn, setLoggedIn] = useState(false)
    const [verified, setVerified] = useState(false)
    
    const location = useLocation()

    // Sets status to loggedIn if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                if (user.emailVerified) {
                    setVerified(true)
                }
                setLoggedIn(true)
            }
        })
        return () => unsubscribe()
    }, [firebaseAuth, location])

    useEffect(() => {

    }, [location])

    return (
        <>
            <Grid>
                <Header bgColor = "grey" height = "100px" loggedIn={loggedIn}/>
                <Main>
                    {children || <Outlet context={{
                        loggedIn, setLoggedIn,
                        verified, setVerified
                    }}/>}
                </Main>
                <Footer/>
            </Grid>
        </>
    )
}