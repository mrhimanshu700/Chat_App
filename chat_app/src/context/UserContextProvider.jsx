import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";
import { useHistory } from "react-router-dom";

function UserContextProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <UserContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
