
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import ChatBody  from '../components/ChatBody';


{/*maybe import local styles */}

function HomePage() {
  const { user, users, chatRooms, currentRoom, SetCurrentRoom, loading, mount, SetMount, SetLoading, SetSuccess, authRouter, SetError, guestMode, SetAlertGuest } = useOutletContext();



  return (
    <>
      <div>Welcome home, <i>{user ? user.alias : "Guest"}</i> </div>
      <ChatBody 
        SetLoading={SetLoading} 
        SetMount={SetMount} 
        mount={mount}
        user={user}
        currentRoom={currentRoom}
        SetCurrentRoom={SetCurrentRoom}
        authRouter={authRouter}
        SetError={SetError}
        guestMode={guestMode}
        SetAlertGuest={SetAlertGuest}
      />
    </> 
  )
}

export default HomePage;