import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

/*
    This is the client API key, which is not supposed to be secret; It's how the client
    determines which firebase project to send to. It's fine to have here.
*/
const firebaseConfig = {
    apiKey: "AIzaSyD0sR_vCnUWa1ZkuhvyTCwYD6P70e3qGFA",
    authDomain: "ag-kilocal.firebaseapp.com",
    projectId: "ag-kilocal",
    storageBucket: "ag-kilocal.firebasestorage.app",
    messagingSenderId: "542755219829",
    appId: "1:542755219829:web:0ed08fda06e70519becb3c",
    measurementId: "G-7XYMCE191N",
};

const firebaseLocalEmulatorConfig = {
    apiKey: "fakeKey",
    authDomain: "localhost",
    projectId: "ag-kilocal",
};
const isLocalDev = import.meta.env.MODE == "development";
const app = initializeApp(isLocalDev ? firebaseLocalEmulatorConfig : firebaseConfig);
export const firebaseAuth = getAuth(app);
if (isLocalDev) {
    connectAuthEmulator(firebaseAuth, "http://localhost:9099");
}
