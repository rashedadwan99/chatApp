import React, { useState } from "react";
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Box,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/chatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import {
  addUserToGroup,
  removeUserFromGroup,
  renameChatGroup,
} from "../../services/chatService";
import { searchUser } from "../../services/userService";
import UserListItem from "../userAvatar/UserListItem";
function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
  const { selectedChat, user: currentUser, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");

  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const closeModal = () => {
    onClose();
    setGroupChatName("");
    setSearchResult([]);
  };

  const handleAddUser = async (user) => {
    if (selectedChat.users.find((u) => u._id === user._id)) {
      toast({
        title: "User already added in group",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== currentUser._id) {
      toast({
        title: "Only admin can add someone",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await addUserToGroup(selectedChat._id, user._id);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleRemoveUser = async (user) => {
    const oldSelectedChat = selectedChat;
    if (
      selectedChat.groupAdmin._id !== currentUser._id &&
      currentUser._id !== user._id
    ) {
      toast({
        title: "Only admin can remove someone",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    oldSelectedChat.users = oldSelectedChat.users.filter(
      (u) => u._id !== user._id
    );
    setSelectedChat(oldSelectedChat);
    try {
      setLoading(true);
      const { data } = await removeUserFromGroup(selectedChat._id, user._id);
      user._id === currentUser._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description: error.response.data.message,
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setSelectedChat(oldSelectedChat);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      return toast({
        title: "the new Chat name is required",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
    try {
      setRenameLoading(true);
      const { data } = await renameChatGroup(selectedChat._id, groupChatName);
      setRenameLoading(false);
      setFetchAgain(!fetchAgain);
      setSelectedChat(data);
    } catch (error) {
      toast({
        status: "error",
        description: error.response.data,
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleSearch = async (e) => {
    const searchQuery = e.target.value;
    if (!searchQuery) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await searchUser(searchQuery);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occoured",
        description: "Failed to Load the Search Results.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };
  return (
    <>
      <IconButton d={{ base: "flex" }} onClick={onOpen} icon={<ViewIcon />} />

      <Modal isOpen={isOpen} onClose={closeModal} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work Sans"
            fontSize="35px"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((user) => {
                return (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleRemoveUser(user)}
                  />
                );
              })}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                value={groupChatName}
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                mb={1}
                onChange={(e) => handleSearch(e)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                );
              })
            )}
          </ModalBody>
          {/* <Box w="100%" display="flex" flexWrap="wrap" px={5}>
            {selectedUsers.map((user) => {
              return (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              );
            })}
          </Box> */}
          {/* <Box px={5}>
            {loading ? (
              <div>loading..</div>
            ) : (
              searchResult?.slice(0.4).map((user) => {
                return (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => handleSelectedUser(user)}
                  />
                );
              })
            )}
          </Box> */}
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleRemoveUser(currentUser)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
