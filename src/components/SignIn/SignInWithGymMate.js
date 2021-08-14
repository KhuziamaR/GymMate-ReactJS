import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase";
import database from "../../firebase";
import SaveIcon from "@material-ui/icons/Save";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";

import { auth } from "../../firebase";
import { provider } from "../../firebase";
import { actionTypes } from "../../reducer";
import { emphasize, makeStyles } from "@material-ui/core";
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
}));

function SignInWithGymMate() {
  const classes = useStyles();
  //   const [{ user }, dispatch] = useStateValue();
  const [{}, dispatch] = useStateValue();
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);

  const signIn = (e) => {
    e.preventDefault();
    console.log("signin");
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: userCredential.user,
        });
      })
      .catch((error) => {
        alert("Incorrect Username And/or Password");
      });
  };

  return (
    <div>
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
                <Button variant="contained">Cancel</Button>
              </Link>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                // onClick={signUp}
                onSubmit={signIn}
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
