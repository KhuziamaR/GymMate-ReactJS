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
function App() {
  const [{ user }, dispatch] = useStateValue();
  // const [liked, setLiked] = useState([]);
  // const [likedMe, setLikedMe] = useState([]);
  // const [disliked, setDisliked] = useState([]);
  // const [removed, setRemoved] = useState([]);
  const [reloadArrays, setReloadArrays] = useState(false);
  let profilesLiked = new Set();
  let profilesLikedMe = new Set();
  let profilesDisliked = new Set();
  let profilesRemoved = new Set();
  const setLikedArray = async () => {
    const snapshot = await database
      .collection("people")
      .doc(user.uid)
      .collection("profilesLiked")
      .get();
    return snapshot.docs.map((doc) => profilesLiked.add(doc.data().uid));
  };
  const setLikedMeArray = async () => {
    const snapshot = await database
      .collection("people")
      .doc(user.uid)
      .collection("profilesLikedMe")
      .get();
    return snapshot.docs.map((doc) => profilesLikedMe.add(doc.data().uid));
  };
  const setDislikesArray = async () => {
    const snapshot = await database
      .collection("people")
      .doc(user.uid)
      .collection("dislikes")
      .get();
    return snapshot.docs.map((doc) => profilesDisliked.add(doc.data().uid));
  };

  useEffect(() => {
    if (user) {
      var docRef = database.collection("people").doc(user.uid);
      docRef
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.log("new user");
          } else {
            setLikedArray().then(
              setLikedMeArray().then(
                setDislikesArray().then(() => {
                  profilesRemoved = [...profilesDisliked, ...profilesLiked];
                  console.log(
                    profilesDisliked,
                    profilesLiked,
                    profilesLikedMe,
                    profilesRemoved
                  );
                  if (!reloadArrays) {
                    setReloadArrays(!reloadArrays);
                  }
                })
              )
            );
          }
        })
        .catch((error) => {
          alert("error");
        });
    }
  }, [user, reloadArrays]);

  return (
    <ToastProvider autoDismiss autoDismissTimeout="3000">
      <div className="App">
        {!user ? (
          <Router>
            <Switch>
              <Route path="/signin">
                <SignInWithGymMate />
              </Route>
              <Route path="/signup">
                <Registration />
              </Route>
              <Route path="/">
                <Login />
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
              <Route path="/chat/:person">
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
                <GymMateCards
                  alreadyLiked={profilesLiked}
                  alreadyDisliked={profilesDisliked}
                  alreadyLikedMe={profilesLikedMe}
                  alreadyRemoved={profilesRemoved}
                />
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
