import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import "./App.css";



function App() {
  const user = localStorage.getItem("user")
  return (
    <div className="App">
      <Switch>
        <Route path="/chats" render={(props) => user ? <ChatPage {...props} /> : <Redirect to="/" />} exact />
        <Route path="/" render={(props) => !user ? <HomePage {...props} /> : <Redirect to="/chats" />} exact />
      </Switch>
    </div>
  );
}

export default App;
