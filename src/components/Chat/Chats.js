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
    console.log(chatMatches);
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
  // useEffect(() => {
  //   if (matches) {
  //     matches.forEach((match) => {
  //       var docRef = database.collection("people").doc(match);
  //       docRef
  //         .get()
  //         .then((doc) => {
  //           if (doc.exists) {
  //             setChatMatches(...chatMatches, {
  //               username: doc.data().username,
  //               profileImgUrl: doc.data().profileImgUrl,
  //             });
  //           }
  //         })
  //         .catch((error) => {
  //           console.log("Error getting document:", error);
  //         });
  //     });
  //   }
  // }, [matches]);

  return (
    <div className="chats">
      {
        chatMatches
          ? chatMatches.map((chat) => {
              {
                if (chat != null && chat != undefined) {
                  return (
                    <Chat
                      key={chat.uid}
                      name={chat.username}
                      message="Ball at 6?"
                      timeStamp="42 minutes ago"
                      profilePic={chat.profileImgUrl}
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
