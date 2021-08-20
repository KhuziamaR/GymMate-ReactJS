import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import database from "../../firebase";
import { useStateValue } from "../../StateProvider";
import "./Chats.css";

function Chats() {
  const [{ user, likes, matches, likesme, dislikes }, dispatch] =
    useStateValue();
  const [chatMatches, setChatMatches] = useState([]);

  useEffect(() => {
    // console.log(chatMatches);
    const unsubscribe = database.collection("people").onSnapshot((snapshot) =>
      setChatMatches(
        snapshot.docs.map((doc) => {
          if (matches != null && matches.has(doc.data().uid)) {
            return doc.data();
          }
        })
      )
    );
    return () => {
      // cleanup
      unsubscribe();
    };
  }, []);

  return (
    <div className="chats">
      {
        chatMatches
          ? chatMatches.map((person) => {
              {
                if (person != null && person != undefined) {
                  return (
                    <Chat
                      key={person.uid}
                      personUid={person.uid}
                      name={person.username}
                      message="Ball at 6?"
                      timeStamp="42 minutes ago"
                      profilePic={person.profileImgUrl}
                    />
                  );
                }
              }
            })
          : null
        //   return(
        // <Chat
        //   name="Mark"
        //   message="Ball at 6?"
        //   timeStamp="42 minutes ago"
        //   profilePic="..."
        // />
        // <Chat
        //   name="Jen"
        //   message="whats up dude!"
        //   timeStamp="40 seconds ago"
        //   profilePic="..."
        // />
        // <Chat
        //   name="Sam"
        //   message="Hey bro"
        //   timeStamp="30 minutes ago"
        //   profilePic="..."
        // />
        // )
      }
    </div>
  );
}

export default Chats;
