import {useState, ReactNode, useEffect} from 'react'
import styled from '@emotion/styled'
import { Header } from './Header'
import { Footer } from './Footer'
import { Outlet, useLocation, useNavigate } from "react-router-dom"
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

    const [loggedIn, setLoggedIn] = useState(firebaseAuth.currentUser !== null)
    //const [isVerified, setIsVerified] = useState(firebaseAuth.currentUser?.emailVerified)
    
    const navigate = useNavigate()
    const location = useLocation()

    // Sets status to loggedIn if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (!user) {  
                setLoggedIn(false)
                if (
                    location.pathname !== '/' &&
                    location.pathname !== '/login' &&
                    location.pathname !== '/signup'
                ) {
                    navigate('/')
                }
            } else {
                if (!user.emailVerified && location.pathname !== '/profile') {
                    navigate('/profile')
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
                    {children || <Outlet context={{loggedIn, setLoggedIn}}/>}
                </Main>
                <Footer/>
            </Grid>
        </>
    )
}