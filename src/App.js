import React from "react";
import Header from "./Header";
import GymMateCards from "./GymMateCards";
import SwipeButtons from "./SwipeButtons";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Switch>
          <Route path="/chat">
            <h1> CHAT PAGE</h1>
          </Route>
          <Route path="/">
            <GymMateCards />
            <SwipeButtons />
          </Route>
        </Switch>
      </Router>
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
