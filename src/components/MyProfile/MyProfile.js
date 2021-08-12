import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import { useStateValue } from "../../StateProvider";
import { makeStyles } from "@material-ui/core/styles";
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
          <h2>Welcome, {user.displayName}</h2>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default MyProfile;
