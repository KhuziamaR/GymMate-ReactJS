import React, { useState, useEffect } from "react";
import database from "../../firebase";
import Avatar from "@material-ui/core/Avatar";
import "./ChatScreen.css";
import { useLocation, useParams } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase";
function ChatScreen() {
  const [input, setInput] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const { handle } = useParams();
  const location = useLocation();
  const { name, personUid, profilePic } = location.state;
  const [myName, setMyName] = useState("");
  const [myProfileImg, setMyProfileImg] = useState("");
  const messagesRefToOtherUser = database
    .collection("allchats")
    .doc(personUid)
    .collection("chats")
    .doc(user.uid)
    .collection("messages");
  const messagesRef = database
    .collection("allchats")
    .doc(user.uid)
    .collection("chats")
    .doc(personUid)
    .collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });

  const handleSend = (e) => {
    e.preventDefault();

    messagesRef
      .add({
        text: input,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
        photoURL: user.photoURL,
        name: user.displayName,
      })
      .then(() => {
        messagesRefToOtherUser.add({
          text: input,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid: user.uid,
          photoURL: user.photoURL,
          name: user.displayName,
        });
      });

    setInput("");
  };

  return (
    <div className="chatScreen">
      <p className="chatScreen__timeStamp">
        YOU MATCHED WITH {name.toUpperCase()} ON 8/6/2021
      </p>
      {messages &&
        messages.map((message) =>
          message.uid != user.uid ? (
            <div className="chatScreen__message">
              <Avatar
                className="chatScreen__image"
                alt={message.name}
                src={message.photoURL}
              />
              <p className="chatScreen__text"> {message.text}</p>
            </div>
          ) : (
            <div className="chatScreen__message">
              <p className="chatScreen__textUser"> {message.text}</p>
            </div>
          )
        )}
      <div>
        <form className="chatScreen__input">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="chatScreen__inputField"
            type="text"
            placeholder="Type a message..."
          />
          <button onClick={handleSend} className="chatScreen__inputButton">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatScreen;
