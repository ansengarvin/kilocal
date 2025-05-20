import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD0sR_vCnUWa1ZkuhvyTCwYD6P70e3qGFA",
    authDomain: "ag-kilocal.firebaseapp.com",
    projectId: "ag-kilocal",
    storageBucket: "ag-kilocal.firebasestorage.app",
    messagingSenderId: "542755219829",
    appId: "1:542755219829:web:0ed08fda06e70519becb3c",
    measurementId: "G-7XYMCE191N",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
