import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";

import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { Redirect, useHistory } from "react-router-dom";

function ChatPage() {
  const { user } = ChatState()
  const history = useHistory()
  const [fetchAgain, setFetchAgain] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {

    if (!userInfo) {
      history.push("/");
    }

  }, [history])
  return (
    <div style={{ width: "100%" }}>


      {user && <>
        <SideDrawer />
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          p="10px"
          height="88.5vh"
        >
          <MyChats fetchAgain={fetchAgain} />
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
      </>}

    </div>
  );
}

export default ChatPage;
