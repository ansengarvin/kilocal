import { useState, ReactNode, useEffect } from "react";
import styled from "@emotion/styled";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";
import { firebaseAuth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { tabletView } from "../../lib/defines";
//import { useQuery } from '@tanstack/react-query'

interface RootProps {
    children?: ReactNode;
}

const Grid = styled.div`
    width: 100%;

    display: grid;
    grid-template-areas:
        "header header header"
        "leftgutter main rightgutter"
        "footer footer footer";
    grid-template-columns: 100px 1fr 100px;
    grid-template-rows: auto 1fr auto;

    @media (max-width: ${tabletView}) {
        grid-template-columns: 10px 1fr 10px;
        grid-template-rows: auto 1fr auto;
    }
    row-gap: 15px;

    main {
        grid-area: main;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

export function Root(props: RootProps) {
    const { children } = props;

    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [verified, setVerified] = useState(false);

    // Sets status to loggedIn if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                if (user.emailVerified) {
                    setVerified(true);
                } else {
                    setVerified(false);
                }
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
            setIsLoadingInitial(false);
        });
        return () => unsubscribe();
    }, [firebaseAuth]);

    if (isLoadingInitial) {
        return (
            <>
                <Grid>
                    <Header loggedIn={loggedIn} />
                    <main>LOADING</main>
                    <Footer />
                </Grid>
            </>
        );
    } else {
        return (
            <>
                <Grid>
                    <Header loggedIn={loggedIn} />
                    <main>
                        {children || (
                            <Outlet
                                context={{
                                    loggedIn,
                                    setLoggedIn,
                                    verified,
                                    setVerified,
                                    isLoadingInitial,
                                    setIsLoadingInitial,
                                }}
                            />
                        )}
                    </main>
                    <Footer />
                </Grid>
            </>
        );
    }
}
