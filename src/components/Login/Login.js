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
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="https://material-ui.com/">
        Gym Mate
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "70%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  buttonLogin: {
    margin: theme.spacing(2, 0, 0),
    background: "#e75480",
    borderRadius: 3,
    border: "1px solid #e75480",
    color: "white",
    height: 51,
    fontSize: ".9rem",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    "&:hover": {
      background: "white",
      color: "#e75480",
    },
  },
  buttonGoogle: {
    margin: theme.spacing(0, 0, 0),
    background: "#b31b1b",
    borderRadius: 3,
    border: "1px solid #b31b1b",
    color: "white",
    height: 51,
    fontSize: ".9rem",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    "&:hover": {
      background: "white",
      color: "#b31b1b",
    },
  },
  buttonLoginSmall: {
    margin: theme.spacing(2, 0, 0),
    background: "#e75480",
    borderRadius: 3,
    border: "1px solid #e75480",
    color: "white",
    height: 48,
    fontSize: ".8rem",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    "&:hover": {
      background: "white",
      color: "#e75480",
    },
  },
  buttonGoogleSmall: {
    margin: theme.spacing(0, 0, 0),
    background: "#b31b1b",
    borderRadius: 3,
    border: "1px solid #b31b1b",
    color: "white",
    height: 48,
    fontSize: ".8rem",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    "&:hover": {
      background: "white",
      color: "#b31b1b",
    },
  },
}));

function Login() {
  const matches = useMediaQuery("(min-width:700px)");

  const { addToast } = useToasts();
  const [{}, dispatch] = useStateValue();
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [reloadArrays, setReloadArrays] = useState(false);
  const classes = useStyles();
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
          <h1>Welcome to Gym Mate</h1>
        </div>
        <Container component="main" maxWidth="s">
          <CssBaseline />
          <div className={classes.paper}>
            {!matches ? (
              <form className={classes.form}>
                <Button
                  fullWidth
                  variant="contained"
                  className={classes.buttonGoogleSmall}
                  onClick={signInGoogle}
                >
                  Sign In With Google
                </Button>
                <Link to="/signin">
                  <Button
                    fullWidth
                    variant="contained"
                    className={classes.buttonLoginSmall}
                  >
                    Sign In With Gym Mate
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    fullWidth
                    variant="contained"
                    className={classes.buttonLoginSmall}
                  >
                    Sign up
                  </Button>
                </Link>
              </form>
            ) : (
              <form className={classes.form}>
                <Button
                  fullWidth
                  variant="contained"
                  className={classes.buttonGoogle}
                  onClick={signInGoogle}
                >
                  Sign In With Google
                </Button>
                <Link to="/signin">
                  <Button
                    fullWidth
                    variant="contained"
                    className={classes.buttonLogin}
                  >
                    Sign In With Gym Mate
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    fullWidth
                    variant="contained"
                    className={classes.buttonLogin}
                  >
                    Dont Have an Account? Sign up
                  </Button>
                </Link>
              </form>
            )}
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default Login;
