import React from "react";
import "./Chats.css";
function Chats() {
  return (
    <div className="chats">
      <Chat
        name="Mark"
        message="yo whats up dude!"
        timestamp="40 seconds ago"
        profilePic="..."
      />
    </div>
  );
}

export default Chats;
