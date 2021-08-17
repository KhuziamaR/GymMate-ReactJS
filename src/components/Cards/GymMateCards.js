import React, { useState, useEffect, useMemo } from "react";
import TinderCard from "react-tinder-card";
import "./GymMateCards.css";
import { useStateValue } from "../../StateProvider";
import database from "../../firebase";

let peopleDB = [];
let peopleState = peopleDB;

const setPeopleDB = async () => {
  const snapshot = await database.collection("people").get();
  return snapshot.docs.map((doc) => {
    peopleDB.push(doc.data());
  });
};

setPeopleDB()
  .then((peopleState = peopleDB))
  .then(console.log(peopleDB));

const GymMateCards = ({
  alreadyLiked,
  alreadyDisliked,
  alreadyLikedMe,
  alreadyRemoved,
}) => {
  const [{ user }, dispatch] = useStateValue();
  const [people, setPeople] = useState(peopleDB);
  const [lastDirection, setLastDirection] = useState();

  const childRefs = useMemo(
    () =>
      Array(peopleDB.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  // useEffect(() => {
  //   const unsubscribe = database
  //     .collection("people")
  //     .onSnapshot((snapshot) =>
  //       setPeople(snapshot.docs.map((doc) => doc.data()))
  //     );
  //   return () => {
  //     // cleanup
  //     unsubscribe();
  //   };
  // }, []);
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
            (person) =>
              !alreadyDisliked.has(person.uid) && !alreadyLiked.has(person.uid)
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
      });
  };

  const swiped = (direction, personToDelete) => {
    console.log("removing: " + personToDelete + "  due to swipe " + direction);
    setLastDirection(direction);
    if (direction == "left") {
      alreadyDisliked.add(personToDelete);
      leftSwipe(direction, personToDelete);
    } else if (direction == "right") {
      alreadyLiked.add(personToDelete);
      rightSwipt(direction, personToDelete);
    }
    alreadyRemoved.add({ uid: personToDelete, direction: direction });
    console.log("already disliked:::", alreadyDisliked, "end dislikes");
    console.log("already liked:::", alreadyLiked, "end likes");
  };

  const outOfFrame = (name) => {
    // console.log(name + " left the screen!");
    peopleState = peopleState.filter(
      (person) =>
        person.uid !== name &&
        !alreadyDisliked.has(person.uid) &&
        !alreadyLiked.has(person.uid)
    );
    setPeople(peopleState);
  };

  const swipe = (dir) => {
    const cardsLeft = people.filter(
      (person) => !alreadyRemoved.includes(person.uid)
    );
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].username; // Find the card object to be removed
      const index = peopleDB
        .map((person) => person.username)
        .indexOf(toBeRemoved); // Find the index of which to make the reference to
      alreadyRemoved.add(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir); // Swipe the card!
    }
  };

  // const onSwipe = (direction) => {
  //   // console.log("You Swiped " + direction + " on ");
  //   console.log(direction);
  // };

  return (
    <div>
      <div className="gymmateCards__cardContainer">
        {people.map((person, index) => {
          // console.log(person.uid);
          // if (
          //   alreadyLiked.includes(person.uid) ||
          //   alreadyDisliked.includes(person.uid) ||
          //   alreadyRemoved.includes(person.uid)
          // ) {
          //   return null;
          // }
          if (person.uid != user.uid) {
            return (
              <TinderCard
                className="swipe"
                preventSwipe={["up", "down"]}
                ref={childRefs[index]}
                className="swipe"
                key={person.uid}
                onSwipe={(dir) => swiped(dir, person.uid)}
                onCardLeftScreen={() => outOfFrame(person.uid)}
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
