import React from "react";
import PersonIcon from "@material-ui/icons/Person";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import "./Header.css";
import logo from "./assets/logo.png";
import IconButton from "@material-ui/core/IconButton";

const Header = () => {
  return (
    <div className="header">
      <IconButton>
        <PersonIcon fontSize="large" className="header__icon" />
      </IconButton>

      <img className="header__logo" src={logo} alt="Gymmate" />
      <IconButton>
        <QuestionAnswerIcon fontSize="large" className="header__icon" />
      </IconButton>
    </div>
  );
};

export default Header;
