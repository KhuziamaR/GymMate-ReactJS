import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { BrowserRouter } from "react-router-dom";
import { Redirect } from "react-router";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase";
import database from "../../firebase";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import SaveIcon from "@material-ui/icons/Save";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";

import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./EditProfile.css";

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
  selectImg: {
    paddingTop: "1px",
    paddingBottom: "1px",
    marginTop: "1px",
  },
  button: {
    color: "white",
    backgroundColor: "#e75480",
    "&:hover": {
      color: "white",
      backgroundColor: "#e75480",
      fontSize: "1rem",
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  select: {
    "&:before": {
      borderColor: "#e75480",
    },
    "&:after": {
      borderColor: "#e75480",
    },
  },
  icon: {
    fill: "#e75480",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Weightlifting",
  "Wrestling",
  "Boxing",
  "Gymnastics",
  "Calisthenics",
  "Basketball",
  "Soccer",
  "Track and Field",
  "Swimming",
];

function getStyles(name, sports, theme) {
  return {
    fontWeight:
      sports.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const EditProfile = () => {
  const { addToast } = useToasts();
  const [{ user }, dispatch] = useStateValue();
  const classes = useStyles();
  const [userName, setUserName] = useState(null);
  const [bio, setBio] = useState(null);
  const [age, setAge] = useState(null);
  const [zipcode, setZipcode] = useState(null);
  const [selectedProfileImg, setSelectedProfileImg] = useState(null);
  const [selectedCardImg, setSelectedCardImg] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const theme = useTheme();
  const [sports, setSports] = React.useState([]);
  const [redirect, setRedirect] = useState(false);

  const handleChange = (event) => {
    setSports(event.target.value);
    console.log(sports);
  };

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSports(value);
  };

  const handleProfileImgUploadClick = (event) => {
    setSelectedProfileImg(event.target.files[0]);
    console.log(selectedProfileImg);
  };

  const handleCardImgUploadClick = (event) => {
    setSelectedCardImg(event.target.files[0]);
    console.log(selectedCardImg);
  };

  const updateProfile = (e) => {
    e.preventDefault();
    var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcode);
    if (!isValidZip) {
      addToast("Invalid Zipcode", { appearance: "error" });
      return;
    }
    firebase
      .storage()
      .ref("users/" + user.uid + "/profile.jpg")
      .put(selectedProfileImg)
      .then(function () {
        console.log("successfully uploaded profile image");
        firebase
          .storage()
          .ref("users/" + user.uid + "/card.jpg")
          .put(selectedCardImg)
          .then(function () {
            console.log("successfully uploaded card image");
            firebase
              .storage()
              .ref("users/" + user.uid + "/profile.jpg")
              .getDownloadURL()
              .then((profileImgUrl) => {
                console.log("downloaded profile image url");
                console.log(profileImgUrl);
                firebase
                  .storage()
                  .ref("users/" + user.uid + "/card.jpg")
                  .getDownloadURL()
                  .then((cardImgUrl) => {
                    console.log("downloaded card image url");
                    console.log(cardImgUrl);

                    user
                      .updateProfile({
                        photoURL: profileImgUrl,
                        displayName: userName,
                      })
                      .then(() => {
                        console.log("Successfully updated profile image url");
                        console.log(user);
                        database
                          .collection("people")
                          .doc(user.uid)
                          .set({
                            username: userName,
                            bio: bio,
                            age: age,
                            zipcode: zipcode,
                            profileImgUrl: profileImgUrl,
                            cardImgUrl: cardImgUrl,
                            sports: sports,
                            location: {
                              lat: lat,
                              long: long,
                            },
                          })
                          .then(() => {
                            addToast("Profile Updated Successfully", {
                              appearance: "success",
                            });
                            setRedirect(true);
                          })
                          .catch((error) => {
                            addToast(error.message, { appearance: "error" });
                          });
                      })
                      .catch((error) => {
                        addToast(error.message, { appearance: "error" });
                      });
                  });
              });
          });
      });
  };
  const checkImg = () => {
    if (!selectedCardImg && !selectedProfileImg) {
      addToast("Please select Profile and Card Images", {
        appearance: "error",
      });
    } else if (!selectedCardImg) {
      addToast("Please select Card Image", { appearance: "error" });
    } else if (!selectedProfileImg) {
      addToast("Please select Profile Image", { appearance: "error" });
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  }, []);
  return (
    <div>
      {redirect ? <Redirect push to="/myprofile" /> : null}
      <div className="edit__outterContainer">
        <div className="edit__innerContainer">
          <form className={classes.root2} onSubmit={updateProfile}>
            <Box m={2} pb={1}>
              <h1 className="edit__header">Update Profile</h1>
            </Box>
            <TextField
              onChange={(e) => setUserName(e.target.value)}
              label="User Name"
              variant="outlined"
              inputProps={{ maxLength: 20, minLength: 5 }}
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
              inputProps={{ maxLength: 400, minLength: 15 }}
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
              label="Age"
              variant="outlined"
              type={"number"}
              onChange={(e) => {
                e.target.value < 0
                  ? (e.target.value = 0)
                  : setAge(e.target.value);
              }}
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
              label="ZipCode"
              variant="outlined"
              type={"number"}
              onChange={(e) => {
                e.target.value < 0
                  ? (e.target.value = 0)
                  : setZipcode(e.target.value);
              }}
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
            <h4 className="edit__header">
              Select All of Your Sports Interests
            </h4>
            <FormControl className={classes.formControl}>
              <InputLabel
                id="demo-mutiple-checkbox-label"
                style={{ color: "#e75480" }}
              >
                Training
              </InputLabel>
              <Select
                autoWidth
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                value={sports}
                onChange={handleChange}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                className={classes.select}
                inputProps={{
                  classes: {
                    icon: classes.icon,
                  },
                }}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={sports.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <CardContent className={classes.selectImg}>
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
            <CardContent className={classes.selectImg}>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file-card"
                multiple
                type="file"
                onChange={handleCardImgUploadClick}
                required
              />
              <label htmlFor="contained-button-file-card">
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
                <Button variant="contained" className={classes.buttonCancel}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                onClick={checkImg}
                onSubmit={updateProfile}
                className={classes.buttonSave}
                startIcon={<SaveIcon />}
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
