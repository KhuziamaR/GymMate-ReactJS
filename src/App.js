import React, { useState, useEffect } from "react";
import database from "./firebase";
import Header from "./components/Header/Header";
import GymMateCards from "./components/Cards/GymMateCards";
import SwipeButtons from "./components/SwipeButtons/SwipeButtons";
import ChatScreen from "./components/Chat/ChatScreen";
import Login from "./components/Login/Login";
import MyProfile from "./components/MyProfile/MyProfile";
import Chats from "./components/Chat/Chats";
import EditProfile from "./components/EditProfile/EditProfile";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import Registration from "./components/signUp/Registration";
import SignInWithGymMate from "./components/SignIn/SignInWithGymMate";
import NewUser from "./components/NewUser/NewUser";
import "./App.css";
import { ToastProvider } from "react-toast-notifications";
import ParticlesBg from "particles-bg";

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <ToastProvider autoDismiss autoDismissTimeout="3000">
      <div className="App">
        {!user ? (
          <Router>
            <Switch>
              <Route path="/signin">
                <SignInWithGymMate />
                <ParticlesBg type="lines" bg={true} />
              </Route>
              <Route path="/signup">
                <Registration />
                <ParticlesBg type="lines" bg={true} />
              </Route>
              <Route path="/">
                <Login />
                <ParticlesBg type="lines" bg={true} />
              </Route>
            </Switch>
          </Router>
        ) : (
          <Router>
            <Switch>
              <Route path="/newuser">
                <NewUser />
              </Route>
              <Route path="/myprofile/edit">
                <Header backButton="/myprofile" />
                <EditProfile />
              </Route>
              <Route path="/myprofile">
                <Header backButton="/" />
                <MyProfile />
              </Route>
              <Route path="/chat/:handle">
                <Header backButton="/chat" />
                <ChatScreen />
              </Route>
              <Route path="/chat">
                <Header backButton="/" />
                <Chats />
              </Route>
              <Route path="signup">
                <Registration />
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
    </ToastProvider>
  );
}

export default App;
