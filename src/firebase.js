import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import "firebase/auth"
import * as geofirestore from 'geofirestore';

const app = firebase.initializeApp({
    apiKey: "AIzaSyBJ0F-0F6DirzrqEffNga1LwAyV9_eGPoM",
    authDomain: "sustain-b7e1a.firebaseapp.com",
    projectId: "sustain-b7e1a",
    storageBucket: "sustain-b7e1a.appspot.com",
    messagingSenderId: "93205689116",
    appId: "1:93205689116:web:fa2e5bebc195fe2c9340d9",
    measurementId: "G-9TD82F04MM"
})

export const auth = app.auth()
export const db = firebase.firestore();
export var provider = new firebase.auth.GoogleAuthProvider();
export const firebasevalue = firebase.firestore.FieldValue;
export const storageRef = firebase.storage().ref();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp()
export const GeoFirestore = geofirestore.initializeApp(db);
export const geoRef = firebase.firestore
export const captchaRef = firebase.auth;

export default app