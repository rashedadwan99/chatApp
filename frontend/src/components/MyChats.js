import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { getAllChats } from "../services/chatService";
import { getSender } from "./config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

function MyChats({ fetchAgain }) {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loadingMychats, setLoadingMyChats] = useState(false)
  const toast = useToast();
  const fetchChats = async () => {
    try {
      setLoadingMyChats(true)
      const { data } = await getAllChats();
      setChats(data);
      setLoadingMyChats(false)
    } catch (error) {
      setLoadingMyChats(false)
      toast({
        title: "Error occoured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="10px"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "23px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="colmun"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        fontSize={{ base: "20px", md: "21px" }}
        borderRadius="10px"
        overflowY="hidden"
        fontFamily="Work sans"
      >
        <Stack overflowY="scroll" w="100%">
          {!loadingMychats ? !chats.length ? chats.map((chat) => {
            return (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#28B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="10px"
                key={chat._id}
                display="flex"
                flexDir="column"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            );
          }) :
            <Box width="100%">
              <Text fontSize={{ base: "28px", md: "30px" }}>
                There are no chats, search for user to create a chat with
              </Text>
            </Box> : <Spinner margin="15px auto" />}
        </Stack>
      </Box>
    </Box>
  );
}

export default MyChats;
