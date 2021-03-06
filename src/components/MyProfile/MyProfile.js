import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import TinderCard from "react-tinder-card";
import { useStateValue } from "../../StateProvider";
import { makeStyles } from "@material-ui/core/styles";
import "./MyProfile.css";
import EditProfile from "../EditProfile/EditProfile";
import database from "../../firebase";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./MyProfile.css";
const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
      background: "#white",
      color: "#e75480",
    },
    bottom: "4vh",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    transitionDuration: " 0.4s",
    cursor: "pointer",
    position: "absolute",
    marginLeft: "-80px",
    left: "50%",
    // width: "120px",
    marginTop: "auto",
  },
}));

function MyProfile() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [age, setAge] = useState(null);
  const [cardImgUrl, setCardImgUrl] = useState(null);
  const [noAge, setNoAge] = useState(null);

  useEffect(() => {
    var docRef = database.collection("people").doc(user.uid);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().age == "notSet") {
            setNoAge(true);
          } else {
            setAge(doc.data().age);
          }
          setCardImgUrl(doc.data().cardImgUrl);
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
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
          <h2>
            {user.displayName} {age ? ", " + age : null}
          </h2>
        </div>
        <div>
          <div className="myProfile__miniOutterContainer">
            <div className="myProfile__cardContainer">
              <TinderCard
                className="swipe"
                key={user.uid}
                preventSwipe={["up", "down", "right", "left"]}
              >
                <div
                  style={{
                    backgroundImage: `url(${cardImgUrl})`,
                  }}
                  className="myProfile__card"
                >
                  <h3>{user.displayName}</h3>
                </div>
              </TinderCard>
            </div>
          </div>
        </div>
        <Link to="/myprofile/edit">
          <Button className={classes.buttonSave}>Edit Profile</Button>
        </Link>
      </div>
    </div>
  );
}

export default MyProfile;
