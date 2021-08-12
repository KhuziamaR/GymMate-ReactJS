import React, { useState, useEffect } from "react";
import firebase from "firebase";
import Avatar from "@material-ui/core/Avatar";
import { Box, colors } from "@material-ui/core";
import { useStateValue } from "../../StateProvider";
import { makeStyles } from "@material-ui/core/styles";
import NewUser from "../EditProfile/EditProfile";
import "./MyProfile.css";
import EditProfile from "../EditProfile/EditProfile";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function MyProfile() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <div className="myProfile__outterContainer">
      <div className="myProfile__innerContainer">
        <div className="myProfile__header">
          <h2>My Profile</h2>
          <Avatar
            alt={user.displayName}
            src={user.photoURL}
            className={classes.large}
          />
          <h2>Welcome, {user.firstName}</h2>
        </div>
        <div>
          <EditProfile />
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
