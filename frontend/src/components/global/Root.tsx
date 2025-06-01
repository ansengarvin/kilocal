import { ReactNode, useEffect } from "react";
import styled from "@emotion/styled";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { tabletView } from "../../lib/defines";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/store";
import { userDispatch } from "../../redux/userSlice";
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

    const user = useSelector((state: any) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Sets status to loggedIn if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, () => {
            dispatch(userDispatch.fetchUser());
            dispatch(userDispatch.setLoadedInitial(true));
        });
        return () => unsubscribe();
    }, []);

    // Handle redirects
    useEffect(() => {
        if (user.isLoadedInitial && !user.isSyncing) {
            if (!user.isLoggedIn) {
                if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup") {
                    navigate("/");
                }
                return;
            }

            if (!user.isVerified) {
                if (location.pathname !== "/verify") {
                    navigate("/verify");
                }
                return;
            }

            if (location.pathname === "/verify") {
                navigate("/");
                return;
            }
        }
    }, [user.isLoadedInitial, user.isVerified, user.isLoggedIn, user.isSyncing, location.pathname]);

    if (!user.isLoadedInitial) {
        return (
            <>
                <Grid>
                    <Header />
                    <main>LOADING</main>
                    <Footer />
                </Grid>
            </>
        );
    } else {
        return (
            <>
                <Grid>
                    <Header />
                    <main>{children || <Outlet />}</main>
                    <Footer />
                </Grid>
            </>
        );
    }
}
