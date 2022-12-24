import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { BiSend } from 'react-icons/bi';
import Lottie from "react-lottie";
import { ChatState } from "../context/chatProvider";
import { getSender, getSenderFull } from "./config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import animationData from "../animation/typing.json";
import { getAllMessages, sendMessageHandler } from "../services/messageService";
import ScrollableChat from "./ScrollableChat";
import "./messages.css";


let socket, selectedChatCompare;
function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const {
    user,
    setSelectedChat,
    selectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await getAllMessages(selectedChat._id);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error occoured",
        description: "Failed to fetch the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    setNewMessage("");
  }, [selectedChat]);

  useEffect(() => {
    socket = io(process.env.REACT_APP_ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing fronted", () => setIsTyping(true));
    socket.on("stop typing frontend", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          setNotifications([newMessageRecieved, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  const toast = useToast();
  const sendMessage = async () => {
    if (!newMessage.length) return

    socket.emit("stop typing", selectedChat._id);
    try {
      const { data } = await sendMessageHandler(newMessage, selectedChat._id);
      setNewMessage("");
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error occoured",
        description: "Failed to send the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

  };
  const typingHandler = (e) => {

    e.target.value = e.target.value.trimLeft()
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!isTyping) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTyping = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTyping;
      if (timeDiff >= timerLength) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, [timerLength]);
  };
  return (
    <>
      {selectedChat ? (
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          display="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat("")}
          />
          {!selectedChat.isGroupChat ? (
            <>
              {getSender(user, selectedChat.users)}
              <ProfileModal
                user={getSenderFull(user, selectedChat.users)}
              ></ProfileModal>
            </>
          ) : (
            <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            </>
          )}
        </Text>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="100%"
        >
          <Text pb={3} fontSize="3xl" fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
      {selectedChat && (
        <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          bg="#E8E8E8"
          w="100%"
          h="100%"
          px="5px"
          borderRadius="10px"
          overflowY="hidden"
        >
          {loading ? (
            <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
          ) : (
            <div className="messages">
              <ScrollableChat messages={messages} />
            </div>
          )}
          <FormControl isRequired mt={3} display="flex" alignItems="center" justifyContent="flex-start">
            {isTyping && (
              <div>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: "5px" }}
                />
              </div>
            )}
            <Input
              variant="filled"
              bg="#E0E0E0"
              placeholder="Enter a message.."
              onChange={typingHandler}
              value={newMessage}
              width="93%"

            />

            <BiSend onClick={sendMessage} width="7%" fontSize="35px" cursor="pointer" />
          </FormControl>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
