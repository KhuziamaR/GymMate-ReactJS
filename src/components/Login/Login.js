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
import { Redirect } from "react-router-dom";
function Login() {
  const { addToast } = useToasts();
  const [{}, dispatch] = useStateValue();
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [reloadArrays, setReloadArrays] = useState(false);

  let profilesLiked = new Set();
  let profilesLikedMe = new Set();
  let profilesDisliked = new Set();
  let profilesRemoved = new Set();

  const setLikedArray = async (uid) => {
    const snapshot = await database
      .collection("people")
      .doc(uid)
      .collection("profilesLiked")
      .get();
    return snapshot.docs.map((doc) => profilesLiked.add(doc.data().uid));
  };
  const setLikedMeArray = async (uid) => {
    const snapshot = await database
      .collection("people")
      .doc(uid)
      .collection("profilesLikedMe")
      .get();
    return snapshot.docs.map((doc) => profilesLikedMe.add(doc.data().uid));
  };
  const setDislikesArray = async (uid) => {
    const snapshot = await database
      .collection("people")
      .doc(uid)
      .collection("dislikes")
      .get();
    return snapshot.docs.map((doc) => profilesDisliked.add(doc.data().uid));
  };

  const signInGoogle = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        addToast("Logged in Successfully", { appearance: "success" });

        const fullName = result.user.displayName.split(" ");
        var docRef = database.collection("people").doc(result.user.uid);

        docRef
          .get()
          .then((doc) => {
            if (!doc.exists) {
              setRedirect(true);
              dispatch({
                type: actionTypes.SET_USER,
                user: result.user,
              });
            } else {
              setLikedArray(result.user.uid).then(
                setLikedMeArray(result.user.uid).then(
                  setDislikesArray(result.user.uid).then(() => {
                    profilesRemoved = [...profilesDisliked, ...profilesLiked];
                    let matches = new Set(
                      [...profilesLiked].filter((x) => profilesLikedMe.has(x))
                    );

                    console.log(
                      profilesDisliked,
                      profilesLiked,
                      profilesLikedMe,
                      profilesRemoved
                    );
                    dispatch({
                      type: actionTypes.SET_LIKES,
                      likes: profilesLiked,
                    });
                    dispatch({
                      type: actionTypes.SET_DISLIKES,
                      dislikes: profilesDisliked,
                    });
                    dispatch({
                      type: actionTypes.SET_LIKESME,
                      likesme: profilesLikedMe,
                    });
                    dispatch({
                      type: actionTypes.SET_USER,
                      user: result.user,
                    });
                    dispatch({
                      type: actionTypes.SET_MATCHES,
                      matches: matches,
                    });
                  })
                )
              );
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
      {redirect ? <Redirect push to="/newuser" /> : null}
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
