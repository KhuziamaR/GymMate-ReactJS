import React from "react";
import PersonIcon from "@material-ui/icons/Person";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import "./Header.css";
import logo from "../../assets/logo.png";
// import logo from "../../assets/logo.jpg";

import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Icon } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";

const Header = ({ backButton }) => {
  const history = useHistory();
  return (
    <div className="header">
      {backButton ? (
        <Link>
          <IconButton onClick={() => history.replace(backButton)}>
            <ArrowBackIosIcon fontSize="large" className="iconButton" />
          </IconButton>
        </Link>
      ) : (
        <Link to="/myprofile">
          <IconButton>
            <PersonIcon fontSize="large" className="iconButton" />
          </IconButton>
        </Link>
      )}

      <Link to="/">
        <IconButton>
          <img className="header__logo" src={logo} alt="Gymmate" />
        </IconButton>
      </Link>

      <Link to="/chat">
        <IconButton>
          <QuestionAnswerIcon fontSize="large" className="iconButton" />
        </IconButton>
      </Link>
    </div>
  );
};

export default Header;
