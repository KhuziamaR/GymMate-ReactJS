import React from "react";

import ReplayIcon from "@material-ui/icons/Replay";
import CloseIcon from "@material-ui/icons/Close";
import StarRateIcon from "@material-ui/icons/StarRate";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { IconButton } from "@material-ui/core";
import GymMateCards from "../Cards/GymMateCards";

import "./SwipeButtons.css";

const styleForButton = {
  maxWidth: "80px",
  maxHeight: "80px",
};

function SwipeButtons() {
  const onLeftClick = () => {
    console.log("left");
  };

  const onRightClick = () => {
    console.log("right");
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
      <IconButton className="swipeButtons__star" style={styleForButton}>
        <StarRateIcon fontSize="large" />
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
