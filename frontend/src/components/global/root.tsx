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

    const [isLoadingInitial, setIsLoadingInitial] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)
    const [verified, setVerified] = useState(false)
    
    const location = useLocation()

    // Sets status to loggedIn if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                if (user.emailVerified) {
                    setVerified(true)
                } else {
                    setVerified(false)
                }
                setLoggedIn(true)
            } else {
                setLoggedIn(false)
            }
            setIsLoadingInitial(false)
        })
        return () => unsubscribe()
    }, [firebaseAuth])

    useEffect(() => {
        console.log("Location change alert")
    }, [location])

    useEffect(() => {

    }, [])
    
    if (isLoadingInitial) {
        return (
            <>
                <Grid>
                    <Header bgColor = "grey" height = "100px" loggedIn={loggedIn}/>
                        <Main>
                            LOADING
                        </Main>
                    <Footer/>
                </Grid>
            </>
        )
    } else {
        return (
            <>
                <Grid>
                    <Header bgColor = "grey" height = "100px" loggedIn={loggedIn}/>
                    <Main>
                        {children || <Outlet context={{
                            loggedIn, setLoggedIn,
                            verified, setVerified,
                            isLoadingInitial, setIsLoadingInitial
                        }}/>}
                    </Main>
                    <Footer/>
                </Grid>
            </>
        )
    }
    
}