import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { ChatState } from "../../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { searchUser } from "../../services/userService";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { handleAccessChat } from "../../services/chatService";
import { getSender } from "../config/ChatLogics";
import { useHistory } from "react-router-dom";
function SideDrawer() {
  const history = useHistory()
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleLogout = () => {
    localStorage.removeItem("user");
    history.go("/")
  };

  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Error occoured",
        description: "Please Enter Something in Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await searchUser(search);
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
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await handleAccessChat(userId);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([...chats, data]);
      }

      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Error occoured",
        description: "could not perform this action",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const onClickNotification = (chat, notification) => {
    setSelectedChat(chat);
    setNotifications(notifications.filter((n) => n !== notification));
  };
  const handleCloseDrawer = () => {
    onClose();
    setSearchResult([]);
    setSearch("")
  }
  const handleReadSearchQuery = (query) => {
    if (!query.length) setSearchResult([])
    setSearch(query)
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa fa-search" aria-hidden="true"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontFamily="Work sans" fontSize="2xl">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1}></BellIcon>
            </MenuButton>
            <MenuList pl={2}>
              {!notifications.length
                ? "No New Messages"
                : notifications.map((n) => {
                  return (
                    <MenuItem
                      key={n._id}
                      onClick={() => onClickNotification(n.chat, n)}
                    >
                      {n.chat.isGroupChat
                        ? `New Message in ${n.chat.chatName}`
                        : `New Message From ${getSender(user, n.chat.users)}`}
                    </MenuItem>
                  );
                })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={handleCloseDrawer} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" p={2}>
              <Input
                placeholder="Search By Name or email"
                mr={2}
                value={search}
                onChange={(e) => handleReadSearchQuery(e.target.value)}
                fontSize="15px"
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
          </DrawerBody>
          {loadingChat && <Spinner />}
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
