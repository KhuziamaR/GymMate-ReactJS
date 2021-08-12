import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import "./GymMateCards.css";
import database from "../../firebase";
const GymMateCards = () => {
  const [people, setPeople] = useState([]);
  const [currentPerson, setCurrentPerson] = useState();

  useEffect(() => {
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

  return (
    <div className="gymmateCards__cardContainer">
      {people.map((person) => (
        <TinderCard
          className="swipe"
          key={person.uid}
          preventSwipe={["up", "down"]}
        >
          <div
            style={{ backgroundImage: `url(${person.profileImgUrl})` }}
            className="card"
          >
            <h3>{person.firstName + " " + person.lastName}</h3>
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default GymMateCards;
