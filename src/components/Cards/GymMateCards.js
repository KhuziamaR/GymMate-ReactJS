import React, { useState, useEffect, useMemo } from "react";
import TinderCard from "react-tinder-card";
import "./GymMateCards.css";
import { useStateValue } from "../../StateProvider";
import database from "../../firebase";
import { actionTypes } from "../../reducer";

// let peopleDB = [];
// let peopleState = peopleDB;

// const setPeopleDB = async () => {
//   const snapshot = await database.collection("people").get();
//   return snapshot.docs.map((doc) => {
//     peopleDB.push(doc.data());
//   });
// };

// setPeopleDB()
//   .then((peopleState = peopleDB))
//   .then(console.log(peopleDB));

const GymMateCards = (
  {
    // likes,
    // dislikes,
    // likesMe,
    // alreadyRemoved,
  }
) => {
  const [{ user, likes, matches, likesme, dislikes }, dispatch] =
    useStateValue();
  const [people, setPeople] = useState(new Set());
  const [lastDirection, setLastDirection] = useState();

  // const childRefs = useMemo(
  //   () =>
  //     Array(peopleDB.length)
  //       .fill(0)
  //       .map((i) => React.createRef()),
  //   []
  // );

  useEffect(() => {
    console.log(people);
    const unsubscribe = database
      .collection("people")
      .onSnapshot((snapshot) =>
        setPeople(snapshot.docs.map((doc) => doc.data()))
      );
    return () => {
      // cleanup
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    alert("you have new matches");
    console.log(matches);
    if (matches) {
      matches.forEach((match) => {
        database
          .collection("people")
          .doc(user.uid)
          .collection("matches")
          .doc(match)
          .set({
            uid: match,
          })
          .then(console.log("UPDATED MATCHES", matches));
      });
    }
    console.log("LIKES", likes);
    console.log("LIKES ME", likesme);
  }, [matches]);

  const leftSwipe = (direction, person) => {
    database
      .collection("people")
      .doc(user.uid)
      .collection("dislikes")
      .doc(person)
      .set({
        uid: person,
      })
      .then(
        setPeople(
          people.filter(
            (person) => !dislikes.has(person.uid) && !likes.has(person.uid)
          )
        )
      );
  };
  const rightSwipt = (direction, person) => {
    database
      .collection("people")
      .doc(user.uid)
      .collection("profilesLiked")
      .doc(person)
      .set({
        uid: person,
      })
      .then(
        setPeople(
          people.filter(
            (person) => !dislikes.has(person.uid) && !likes.has(person.uid)
          )
        )
      )
      .then(
        database
          .collection("people")
          .doc(person)
          .collection("profilesLikedMe")
          .doc(user.uid)
          .set({
            uid: user.uid,
          })
      );
  };

  const swiped = (direction, personToDelete) => {
    setLastDirection(direction);
    if (direction == "left") {
      dispatch({
        type: actionTypes.SET_DISLIKES,
        dislikes: dislikes.add(personToDelete),
      });
      leftSwipe(direction, personToDelete);
    } else if (direction == "right") {
      dispatch({
        type: actionTypes.SET_LIKES,
        likes: likes.add(personToDelete),
      });
      rightSwipt(direction, personToDelete);
    }
    // alreadyRemoved.add({ uid: personToDelete, direction: direction });
    // console.log("already disliked:::", dislikes, "end dislikes");
    // console.log("already liked:::", likes, "end likes");
    var match = new Set([...likes].filter((x) => likesme.has(x)));
    if (match.size > 0) {
      dispatch({
        type: actionTypes.SET_MATCHES,
        matches: new Set([...match, ...matches]),
      });
    }
  };

  // const outOfFrame = (name) => {
  //   // console.log(name + " left the screen!");
  //   peopleState = peopleState.filter(
  //     (person) =>
  //       person.uid !== name &&
  //       !dislikes.has(person.uid) &&
  //       !likes.has(person.uid)
  //   );
  //   setPeople(peopleState);
  // };

  // const swipe = (dir) => {
  //   const cardsLeft = people.filter(
  //     (person) => !alreadyRemoved.includes(person.uid)
  //   );
  //   if (cardsLeft.length) {
  //     const toBeRemoved = cardsLeft[cardsLeft.length - 1].username; // Find the card object to be removed
  //     const index = peopleDB
  //       .map((person) => person.username)
  //       .indexOf(toBeRemoved); // Find the index of which to make the reference to
  //     alreadyRemoved.add(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
  //     childRefs[index].current.swipe(dir); // Swipe the card!
  //   }
  // };

  // const onSwipe = (direction) => {
  //   // console.log("You Swiped " + direction + " on ");
  //   console.log(direction);
  // };

  return (
    <div>
      <div className="gymmateCards__cardContainer">
        {[...people].map((person, index) => {
          // console.log(person.uid);
          // if (
          //   likes.includes(person.uid) ||
          //   dislikes.includes(person.uid) ||
          //   alreadyRemoved.includes(person.uid)
          // ) {
          //   return null;
          // }
          if (
            person.uid != user.uid &&
            !likes.has(person.uid) &&
            !dislikes.has(person.uid) &&
            !matches.has(person.uid)
          ) {
            return (
              <TinderCard
                className="swipe"
                preventSwipe={["up", "down"]}
                // ref={childRefs[index]}
                className="swipe"
                key={person.uid}
                onSwipe={(dir) => swiped(dir, person.uid)}
                // onCardLeftScreen={() => outOfFrame(person.uid)}
              >
                <div
                  style={{ backgroundImage: `url(${person.cardImgUrl})` }}
                  className="card"
                >
                  <span id="card__username">
                    <h3>{person.username}</h3>
                  </span>
                </div>
                <div className="card__details">
                  <div className="card__detailsBio">
                    <b>Bio:</b> {person.bio}
                  </div>
                  <div className="card__detailsSports">
                    <b>Sports: </b>
                    {person.sports.map((sport) => sport + " ")}
                  </div>
                </div>
              </TinderCard>
            );
          }
        })}
      </div>
    </div>
  );
};

export default GymMateCards;
