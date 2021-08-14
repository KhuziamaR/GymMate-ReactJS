import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import Geocode from "react-geocode";
import firebase from "firebase";
import database from "../../firebase";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import SaveIcon from "@material-ui/icons/Save";
import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./EditProfile.css";

Geocode.setApiKey("AIzaSyA1EqO90JUwnL9YwiWffzsqB3HxSlXSmik");

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

const EditProfile = () => {
  const [{ user }, dispatch] = useStateValue();
  const classes = useStyles();
  // create state variables for each input
  const [userName, setUserName] = useState(null);
  const [bio, setBio] = useState(null);
  const [age, setAge] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [selectedProfileImg, setSelectedProfileImg] = useState(null);
  const [selectedCardImg, setSelectedCardImg] = useState(null);

  const handleProfileImgUploadClick = (event) => {
    setSelectedProfileImg(event.target.files[0]);
    console.log(selectedProfileImg);
  };

  const handleCardImgUploadClick = (event) => {
    setSelectedCardImg(event.target.files[0]);
    console.log(selectedCardImg);
  };

  const updateProfile = () => {};

  const getPosition = function (options) {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  useEffect(() => {
    getPosition()
      .then((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then(
          (response) => {
            const address = response.results[0].formatted_address;
            let city, state, country;
            for (
              let i = 0;
              i < response.results[0].address_components.length;
              i++
            ) {
              for (
                let j = 0;
                j < response.results[0].address_components[i].types.length;
                j++
              ) {
                switch (response.results[0].address_components[i].types[j]) {
                  case "locality":
                    city = response.results[0].address_components[i].long_name;
                    break;
                  case "administrative_area_level_1":
                    state = response.results[0].address_components[i].long_name;
                    break;
                  case "country":
                    country =
                      response.results[0].address_components[i].long_name;
                    break;
                }
              }
            }
            console.log(city, state, country);
            console.log(address);
          },
          (error) => {
            console.error(error);
          }
        );
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []);

  return (
    <div>
      <div className="edit__outterContainer">
        <div className="edit__innerContainer">
          <form className={classes.root2} onSubmit={updateProfile}>
            <Box m={4} pb={5}>
              <h1 className="edit__header">Edit Profile</h1>
            </Box>
            <TextField
              onChange={(e) => setUserName(e.target.value)}
              label="User Name"
              variant="outlined"
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
              onChange={(e) => setBio(e.target.value)}
              label="Bio"
              variant="outlined"
              multiline
              InputProps={{
                maxLength: 12,
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
              label="Age"
              variant="outlined"
              onChange={(e) => setAge(e.target.value)}
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
            <h3 className="register__header">Select Profile Image</h3>
            <CardContent>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleProfileImgUploadClick}
                required
              />
              <label htmlFor="contained-button-file">
                <Fab
                  component="span"
                  className={classes.button}
                  variant="extended"
                >
                  <AddPhotoAlternateIcon />
                  {selectedProfileImg ? (
                    <h4>{"Profile Image: " + selectedProfileImg.name}</h4>
                  ) : (
                    <h4>Select Profile Image</h4>
                  )}
                </Fab>
              </label>
            </CardContent>
            <h3 className="register__header">Select Card Image</h3>
            <CardContent>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleCardImgUploadClick}
                required
              />
              <label htmlFor="contained-button-file">
                <Fab
                  component="span"
                  className={classes.button}
                  variant="extended"
                >
                  <AddPhotoAlternateIcon />
                  {selectedCardImg ? (
                    <h4>{"Card Image: " + selectedCardImg.name}</h4>
                  ) : (
                    <h4>Select Card Image</h4>
                  )}
                </Fab>
              </label>
            </CardContent>
            <div>
              <Link to="/myprofile">
                <Button variant="contained">Cancel</Button>
              </Link>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                onSubmit={updateProfile}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditProfile;
