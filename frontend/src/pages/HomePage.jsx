
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import ChatBody  from '../components/ChatBody';


{/*maybe import local styles */}

function HomePage() {
  const { user, users, chatRooms, currentRoom, SetCurrentRoom, loading, mount, SetMount, SetLoading, SetSuccess, authRouter, SetError } = useOutletContext();



  return (
    <>
      <div>Welcome home, <i>{user.alias}</i> </div>
      <ChatBody 
        SetLoading={SetLoading} 
        SetMount={SetMount} 
        mount={mount}
        user={user}
        currentRoom={currentRoom}
        SetCurrentRoom={SetCurrentRoom}
        authRouter={authRouter}
        SetError={SetError}
      />
    </> 
  )
}

export default HomePage;