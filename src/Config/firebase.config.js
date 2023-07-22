// Import the functions you need from the SDKs you need
// const { initializeApp } = require("firebase/app");
// const { getStorage } = require("firebase/storage");
import {initializeApp} from "firebase/app"
import {getStorage} from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_GNpk0PaqpJfnzsT5w7MSQiCLO6155Fg",
  authDomain: "online-ecom.firebaseapp.com",
  projectId: "online-ecom",
  storageBucket: "online-ecom.appspot.com",
  messagingSenderId: "1004148070309",
  appId: "1:1004148070309:web:139fa51f5d30d6285cfa4c",
  measurementId: "G-DRQ147JNNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Storage = getStorage(app)

export {Storage}