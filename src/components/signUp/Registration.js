import React, { useState, useEffect } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase";
import database from "../../firebase";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";

import { actionTypes } from "../../reducer";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
// import logo from "../../assets/logo.png";
import "./Registration.css";

const useStyles = makeStyles((theme) => ({
  root: {
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
  input: {
    display: "none",
  },
}));

function Registration() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [age, setAge] = useState(null);
  const [pass, setPass] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [file, setFile] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState("");

  const handleUploadClick = (event) => {
    setFile(event.target.files[0]);
    console.log(file);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      }
    });
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    console.log("signup");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .then((auth) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: auth.user,
        });
        firebase
          .storage()
          .ref("users/" + auth.user.uid + "/profile.jpg")
          .put(file)
          .then(function () {
            console.log("successfully uploaded image");
            firebase
              .storage()
              .ref("users/" + auth.user.uid + "/profile.jpg")
              .getDownloadURL()
              .then((imgUrl) => {
                console.log("downloaded image url");
                console.log(imgUrl);
                setProfileImgUrl(imgUrl);
                const user = firebase.auth().currentUser;
                user
                  .updateProfile({
                    photoURL: imgUrl,
                    firstName: firstName,
                    lastName: lastName,
                    fullName: firstName + " " + lastName,
                    displayName: firstName + " " + lastName,
                    email: email,
                    age: age,
                  })
                  .then(() => {
                    console.log("Successfully updated profile image url");
                    database
                      .collection("people")
                      .doc(auth.user.uid)
                      .set({
                        firstName: firstName,
                        lastName: lastName,
                        fullName: firstName + " " + lastName,
                        age: age,
                        location: {
                          lat: lat,
                          long: long,
                        },
                        uid: auth.user.uid,
                        profileImgUrl: imgUrl,
                      })
                      .then(() => {
                        console.log("Document successfully written!");
                      })
                      .catch((error) => {
                        console.error("Error writing document: ", error);
                      });
                  })
                  .catch((error) => {
                    console.log("Cannot update profile image url");
                  });
              });
          })
          .catch((error) => {
            console.log(error.message);
          });
      });
  };

  return (
    <div className="register__outterContainer">
      <div className="register__innerContainer">
        <form className={classes.root} onSubmit={signUp}>
          <Box m={4} pb={5}>
            <h1>Sign Up</h1>
          </Box>
          <TextField
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            label="First Name"
            variant="outlined"
            required
          />
          <TextField
            onChange={(e) => setLastName(e.target.value)}
            label="Last Name"
            variant="outlined"
            required
          />
          <TextField
            onChange={(e) => setAge(e.target.value)}
            label="Age"
            variant="outlined"
            required
          />
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            variant="outlined"
            type="email"
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <h3>Select Profile Image</h3>
          <CardContent>
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleUploadClick}
              required
            />
            <label htmlFor="contained-button-file">
              <Fab component="span" className={classes.button}>
                <AddPhotoAlternateIcon />
              </Fab>
            </label>

            {file ? <h4>{file.name}</h4> : <br></br>}
          </CardContent>

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
              onSubmit={signUp}
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
