import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import UserListItem from "./UserAvatar/UserListItem";

function SlidDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats } = useContext(UserContext);

  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`https://chat-app-qxlf.onrender.com/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`https://chat-app-qxlf.onrender.com/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <div className="w-full h-[60px] flex justify-between bg-blue-300">
      <div className=" mx-4 my-2">
        <button
          className="flex justify-center items-center bg-white p-2 text-center rounded-md hover:bg-slate-200"
          onClick={onOpen}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          <h3 className="mx-1">search User</h3>
        </button>
      </div>
      <div className=" mx-4 my-4">
        <h1 className=" font-extrabold text-gray-500 text-xl font-sans">
          CHAT WITH FRIENDS
        </h1>
      </div>
      <div>
        <div className="flex items-center">
          <Menu>
            <MenuButton>
              <BellIcon fontSize="2xl" m={4} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton bg="white" as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.username}
                src={user.image}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>search User</DrawerHeader>

          <DrawerBody>
            <div display="flex">
              <input
                type="text"
                placeholder="search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleSearch}
                className="ml-2 p-2 bg-blue-500 text-white rounded"
              >
                Go
              </button>
            </div>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default SlidDrawer;
