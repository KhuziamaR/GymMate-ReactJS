import React from "react";
import Chat from "./Chat";
import "./Chats.css";
function Chats() {
  return (
    <div className="chats">
      <Chat
        name="Mark"
        message="Ball at 6?"
        timeStamp="42 minutes ago"
        profilePic="..."
      />
      <Chat
        name="Jen"
        message="whats up dude!"
        timeStamp="40 seconds ago"
        profilePic="..."
      />
      <Chat
        name="Sam"
        message="Hey bro"
        timeStamp="30 minutes ago"
        profilePic="..."
      />
    </div>
  );
}

export default Chats;
