import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import "./GymMateCards.css";
const GymMateCards = () => {
  const [people, setPeople] = useState([
    {
      name: "steve jobs",
      url: "https://addicted2success.com/wp-content/uploads/2017/11/10-Things-We-Can-Learn-From-the-Incredible-Steve-Jobs.jpg",
    },
    {
      name: "arnold schwartz",
      url: "https://www.muscleandfitness.com/wp-content/uploads/2019/05/10-Best-Arms-Olympia-Arnold-Schwarzenegar.jpg?w=940&h=529&crop=1&quality=86&strip=all",
    },
  ]);

  return (
    <div>
      <h1>GymMate Cards</h1>
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
              <h3>{person.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default GymMateCards;
