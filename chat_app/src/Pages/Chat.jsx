import React, { useContext, useState } from "react";

import UserContext from "../context/UserContext";
import SlidDrawer from "../component/SlidDrawer";
import MyChats from "../component/MyChats";
import ChatBox from "../component/ChatBox/ChatBox";

function Chat() {
  const { user } = useContext(UserContext);
  const [fetchAgain, setFetchAgain] = useState();
  return (
    <div className="bg-blue-50   w-full  h-screen">
      {user && <SlidDrawer />}
      <div className="flex justify-between">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
}

export default Chat;
