import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import database from "../../firebase";
import { useStateValue } from "../../StateProvider";
import "./Chats.css";
import { useCollection } from "react-firebase-hooks/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

function Chats() {
  const [{ user, likes, matches, likesme, dislikes }, dispatch] =
    useStateValue();
  const [chatMatches, setChatMatches] = useState([]);
  const lastMessages = [];
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
  // useEffect(() => {
  //   chatMatches.map((person) => {
  //     getLast(person);
  //     console.log();
  //   });
  // }, [chatMatches]);

  // const getLast = (uid) => {
  //   const query = database
  //     .collection("allchats")
  //     .doc(user.uid)
  //     .collection("chats")
  //     .doc(uid)
  //     .collection("messages")
  //     .orderBy("createdAt", "desc")
  //     .limit(1);
  //   return query.get().then((doc) => {
  //     if (doc.exists) {
  //       var last = doc.docs[doc.docs.length - 1];
  //       //   var element = {
  //       //     uid: {
  //       //       text: last.data().text,
  //       //       timeStamp: last.data().createdAt,
  //       //     },
  //       //   };
  //       //   lastMessages.push(element);
  //       // }
  //       console.log("last", last.data().text, last.data().createdAt);
  //     }
  //   });
  // };
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  return (
    <div className="chats">
      {chatMatches
        ? chatMatches.map((person) => {
            {
              if (person != null && person != undefined) {
                return (
                  <Chat
                    key={person.uid}
                    personUid={person.uid}
                    name={person.username}
                    message={`I'm ${person.username}, nice to meet you`}
                    timeStamp={`${randomIntFromInterval(1, 60)} minutes ago`}
                    profilePic={person.profileImgUrl}
                  />
                );
              }
            }
          })
        : null}
    </div>
  );
}

export default Chats;
