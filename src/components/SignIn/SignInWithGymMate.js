import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase";
import database from "../../firebase";
import Box from "@material-ui/core/Box";

import { Redirect } from "react-router-dom";

import { actionTypes } from "../../reducer";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./SignInWithGymMate.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "&$focused $notchedOutline": {
      borderColor: "#e75480",
    },
    "&:hover $notchedOutline": {
      borderColor: "#e75480",
    },
    "&$disabled $notchedOutline": {
      borderColor: "#e75480",
    },
  },
  root2: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
  focused: {},
  disabled: {},
  notchedOutline: {},

  input: {
    display: "none",
  },
  buttonSave: {
    background: "#e75480",
    borderRadius: 3,
    border: "1px solid #e75480",
    color: "white",
    height: 48,
    fontSize: "1rem",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    "&:hover": {
      background: "#e75480",
      fontSize: "1.2rem",
    },
  },
  buttonCancel: {
    background: "white",
    borderRadius: 3,
    border: "1px solid #e75480",
    color: "#e75480",
    height: 48,
    fontSize: "1rem",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    "&:hover": {
      fontSize: "1.2rem",
    },
  },
}));

function SignInWithGymMate() {
  const { addToast } = useToasts();
  const classes = useStyles();
  //   const [{ user }, dispatch] = useStateValue();
  const [{}, dispatch] = useStateValue();
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);
  const [redirect, setRedirect] = useState(false);

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

  const signIn = (e) => {
    e.preventDefault();
    console.log("signin");
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then((result) => {
        addToast("Logged In Successfully", { appearance: "success" });
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
      .catch((error) => {
        addToast("Incorrect Username and/or Password", { appearance: "error" });
      });
  };

  return (
    <div>
      {redirect ? <Redirect push to="/newuser" /> : null}

      <div className="register__outterContainer">
        <div className="register__innerContainer">
          <form className={classes.root2} onSubmit={signIn}>
            <Box m={4} pb={5}>
              <h1 className="register__header">Sign In</h1>
            </Box>

            <TextField
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              variant="outlined"
              type="email"
              InputProps={{
                classes: {
                  root: classes.root,
                  focused: classes.focused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              InputLabelProps={{
                style: { color: "#e75480" },
              }}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) => setPass(e.target.value)}
              InputProps={{
                classes: {
                  root: classes.root,
                  focused: classes.focused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              InputLabelProps={{
                style: { color: "#e75480" },
              }}
              required
            />
            <div>
              <Link to="/">
                <Button variant="contained" className={classes.buttonCancel}>
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                onSubmit={signIn}
                className={classes.buttonSave}
              >
                SignIn
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInWithGymMate;
