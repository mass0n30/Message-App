
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import ChatBody  from '../components/ChatBody';


{/*maybe import local styles */}

function HomePage() {
  const { user, users, chatRooms, currentRoom, setCurrentRoom, loading, mount, setMount, setLoading, setSuccess, authRouter, setError, guestMode, setAlertGuest
    , toggleMessages, setToggleMessages, setToggledFriendId, toggledFriendId, setFriends, setUserMessages, messageContent, setMessageContent, setToggleDirectMessage
   } = useOutletContext();



  return (
    <>
      <div>Welcome home, <i>{user ? user.alias : "Guest"}</i> </div>
      <ChatBody 
        setLoading={setLoading}
        setMount={setMount}
        mount={mount}
        user={user}
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
        authRouter={authRouter}
        setError={setError}
        guestMode={guestMode}
        setAlertGuest={setAlertGuest}
        setToggledFriendId={setToggledFriendId}
        toggledFriendId={toggledFriendId}
      />
    </> 
  )
}

export default HomePage;