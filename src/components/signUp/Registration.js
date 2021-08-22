import React, { useState, useEffect } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import firebase from "firebase";
import Box from "@material-ui/core/Box";

import { useStateValue } from "../../StateProvider";
import { Redirect } from "react-router-dom";
import { actionTypes } from "../../reducer";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

import "./Registration.css";

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
  focused: {},
  disabled: {},
  notchedOutline: {},

  input: {
    display: "none",
  },
}));

function Registration() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const signUp = (e) => {
    e.preventDefault();

    console.log("signup");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .then((auth) => {
        setRedirect(true);
        dispatch({
          type: actionTypes.SET_USER,
          user: auth.user,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="register__outterContainer">
      {redirect ? <Redirect push to="/newuser" /> : null}
      <div className="register__innerContainer">
        <form className={classes.root2} onSubmit={signUp}>
          <Box m={4} pb={5}>
            <h1 className="register__header">Sign Up</h1>
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
              onSubmit={signUp}
              className={classes.buttonSave}
            >
              Signup
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
