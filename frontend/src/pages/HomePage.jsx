
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import ChatBody  from '../components/ChatBody';


{/*maybe import local styles */}

function HomePage() {
  const { user, users, chatRooms, currentRoom, SetCurrentRoom, loading, 
    success, SetLoading, SetSuccess, SetNewFetch } = useOutletContext();

  
  useEffect(() => {
    if (chatRooms && chatRooms.length > 0) {
      SetCurrentRoom(chatRooms[0]); // default to Global chatroom
    }
  }, [chatRooms]);

  return (
    <>
      <div>Welcome home, <i>{user.alias}</i> </div>
      <ChatBody 
        success={success} 
        SetSuccess={SetSuccess} 
        SetLoading={SetLoading} 
        SetNewFetch={SetNewFetch} 
        user={user}
      />
    </> 
  )
}

export default HomePage;