import React, { useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../context/chatProvider";
import { searchUser } from "../../services/userService";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { createGroupChat } from "../../services/chatService";

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingGroupCreation, setLoadingGroupCreation] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { user: currentUser, chats, setChats } = ChatState();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await searchUser(query);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occoured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSelectedUser = (user) => {
    if (selectedUsers.includes(user)) {
      return toast({
        title: "User already added",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const closeModal = () => {
    onClose();
    setSelectedUsers([]);
    setGroupChatName("");
    setSearchResult([]);
  };

  const handleDelete = (user) => {
    const updatedSelectedUser = selectedUsers.filter((u) => u._id !== user._id);
    setSelectedUsers(updatedSelectedUser);
  };
  const handleSubmit = async () => {
    if (!selectedUsers.length || !groupChatName) {
      toast({
        title: "Please fill al the feilds",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {

      setLoadingGroupCreation(true)
      const { data } = await createGroupChat(selectedUsers, groupChatName);
      setChats([data, ...chats]);
      setLoadingGroupCreation(false)
      closeModal();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      setLoadingGroupCreation(false)
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
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={closeModal} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work Sans"
            fontSize="35px"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                value={groupChatName}
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input placeholder="Add Users" mb={1} onChange={handleSearch} value={searchQuery} />
            </FormControl>
          </ModalBody>
          <Box w="100%" display="flex" flexWrap="wrap" px={5}>
            {selectedUsers.map((user) => {
              return (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              );
            })}
          </Box>
          <Box px={5} style={{
            maxHeight: "44vh",
            overflowY: "scroll"
          }}>
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
          </Box>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={!loadingGroupCreation && handleSubmit}>
              {loadingGroupCreation ? <Spinner /> : "Create Chat"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
