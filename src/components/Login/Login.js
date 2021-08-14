import React, { useState, useEffect } from "react";
import { auth, provider } from "../../firebase";
import "./Login.css";
import logo from "../../assets/logo.png";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase";
import database from "../../firebase";
import { Link, useHistory } from "react-router-dom";
import { ToastProvider, useToasts } from "react-toast-notifications";
function Login() {
  const { addToast } = useToasts();
  const [{}, dispatch] = useStateValue();
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const signInGoogle = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        addToast("Logged in Successfully", { appearance: "success" });
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });

        const fullName = result.user.displayName.split(" ");
        var docRef = database.collection("people").doc(result.user.uid);

        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Document Data: ", doc.data());
            } else {
              database
                .collection("people")
                .doc(result.user.uid)
                .set({
                  firstName: fullName[0],
                  lastName: fullName[1],
                  age: "notSet",
                  location: {
                    lat: lat,
                    long: long,
                  },
                  uid: result.user.uid,
                  profileImgUrl: result.user.photoURL,
                  newUser: false,
                });
            }
          })
          .catch((error) => {
            addToast(error.message, { appearance: "error" });
          });
      })
      .catch((error) => addToast(error.message, { appearance: "error" }));
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      }
    });
  }, []);
  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} alt="Gym Mate Logo" />
        <div className="login__text">
          <h1>Sign in to Gym Mate</h1>
        </div>
        <Link to="/signin">
          <div className="login__withGoogle">
            <img src={logo} alt="GymMate Logo" />
            <span>Sign In with Gym Mate</span>
          </div>
        </Link>
        <div className="login__withGoogle" onClick={signInGoogle}>
          <img
            src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
            alt="Google Logo"
          />
          <span>Sign In with Google</span>
        </div>
        <Link to="/signup">
          <div className="login__withGoogle">
            <div>Dont have an Account? Sign Up Here.</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Login;
