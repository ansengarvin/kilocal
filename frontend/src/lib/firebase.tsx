import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

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

console.log(import.meta.env.MODE);
