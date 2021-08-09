import React, { useState } from "react";
import Header from "./Header";
import GymMateCards from "./GymMateCards";
import SwipeButtons from "./SwipeButtons";
import ChatScreen from "./ChatScreen";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Chats from "./Chats";
import { useStateValue } from "./StateProvider";
import MyProfile from "./MyProfile";

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
