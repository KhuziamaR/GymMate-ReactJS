import React from "react";
import database from "../../firebase";
import ReplayIcon from "@material-ui/icons/Replay";
import CloseIcon from "@material-ui/icons/Close";
import StarRateIcon from "@material-ui/icons/StarRate";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import CachedIcon from "@material-ui/icons/Cached";
import { IconButton } from "@material-ui/core";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import { ToastProvider, useToasts } from "react-toast-notifications";
import GymMateCards from "../Cards/GymMateCards";

import "./SwipeButtons.css";

const styleForButton = {
  maxWidth: "80px",
  maxHeight: "80px",
};

function SwipeButtons() {
  const [{ user, likes, likesme, matches }, dispatch] = useStateValue();
  const { addToast } = useToasts();

  const onLeftClick = () => {
    console.log("left");
  };

  const onRightClick = () => {};

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
  const refresh = () => {
    setLikedArray(user.uid)
      .then(
        setLikedMeArray(user.uid).then(
          setDislikesArray(user.uid).then(() => {
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
              type: actionTypes.SET_MATCHES,
              matches: matches,
            });
          })
        )
      )
      .then(() => {
        var match = new Set([...likes].filter((x) => likesme.has(x)));
        if (match.size > 0) {
          dispatch({
            type: actionTypes.SET_MATCHES,
            matches: new Set([...match, ...matches]),
          });
          addToast("New Matches!", { appearance: "success" });
        }
      });
  };

  return (
    <div className="swipeButtons">
      {/* <IconButton className="swipeButtons__repeat" style={styleForButton}>
        <ReplayIcon fontSize="large" />
      </IconButton> */}
      <IconButton
        className="swipeButtons__left"
        style={styleForButton}
        onClick={onLeftClick}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      <IconButton
        className="swipeButtons__cache"
        style={styleForButton}
        onClick={refresh}
      >
        <CachedIcon fontSize="large" />
      </IconButton>
      <IconButton
        className="swipeButtons__right"
        style={styleForButton}
        onClick={onRightClick}
      >
        <FavoriteIcon fontSize="large" />
      </IconButton>
      {/* <IconButton className="swipeButtons_lightning" style={styleForButton}>
        <FlashOnIcon fontSize="large" />
      </IconButton> */}
    </div>
  );
}

export default SwipeButtons;
