import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import "./GymMateCards.css";
import database from "../../firebase";
const GymMateCards = () => {
  const [people, setPeople] = useState([]);

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
    <div>
      <div className="gymmateCards__cardContainer">
        {people.map((person) => (
          <TinderCard
            className="swipe"
            key={person.name}
            preventSwipe={["up", "down"]}
          >
            <div
              style={{ backgroundImage: `url(${person.url})` }}
              className="card"
            >
              <h3>{person.firstName + " " + person.lastName}</h3>
              {console.log(person)}
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default GymMateCards;
