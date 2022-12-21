import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../context/chatProvider";
import SingleChat from "./SingleChat";
function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: !selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="10px"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default ChatBox;
