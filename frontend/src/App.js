import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import { ChatState } from "./context/chatProvider";
import "./App.css";



function App() {
  const { user } = ChatState()
  return (
    <div className="App">
      <Switch>


        <Route path="/" component={HomePage} exact />
        <Route path="/chats" component={ChatPage} exact />
      </Switch>
    </div>
  );
}

export default App;
