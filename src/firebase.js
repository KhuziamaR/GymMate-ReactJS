// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA__1OheIggb1rI7fI00jisl5lxpdHfRrE",
  authDomain: "gym-mate-reactjs.firebaseapp.com",
  projectId: "gym-mate-reactjs",
  storageBucket: "gym-mate-reactjs.appspot.com",
  messagingSenderId: "699294529045",
  appId: "1:699294529045:web:39f0bc17fe6b279b6b401c",
  measurementId: "G-YN8E7PGLSH",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const database = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default database;
