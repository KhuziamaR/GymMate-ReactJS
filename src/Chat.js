import React from "react";
import Avatar from "@material-ui/core/Avatar";
function Chat({ name, message, timeStamp, profilePic }) {
  return (
    <div className="chat">
      <Avatar />
    </div>
  );
}

export default Chat;
