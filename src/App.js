import React, { useState } from "react";

import Header from "./components/Header/Header";
import GymMateCards from "./components/Cards/GymMateCards";
import SwipeButtons from "./components/SwipeButtons/SwipeButtons";
import ChatScreen from "./components/Chat/ChatScreen";
import Login from "./components/Login/Login";
import MyProfile from "./components/MyProfile/MyProfile";
import Chats from "./components/Chat/Chats";
import NewUser from "./components/NewUser/NewUser";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <Router>
          <Switch>
            <Route path="/myprofile">
              <Header backButton="/" />
              <MyProfile />
            </Route>
            <Route path="/chat/:person">
              <Header backButton="/chat" />
              <ChatScreen />
            </Route>
            <Route path="/chat">
              <Header backButton="/" />
              <Chats />
            </Route>
            <Route path="/">
              <Header />
              <GymMateCards />
              <SwipeButtons />
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default App;
{
  /* Header  */
}
{
  /* Gym Mate Card */
}
{
  /* Buttons below card */
}

{
  /* Chat View */
}
{
  /* individual chat views */
}
