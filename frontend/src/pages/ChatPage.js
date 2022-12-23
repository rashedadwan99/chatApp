import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";

import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";



function ChatPage() {
  const { user } = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false);

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
