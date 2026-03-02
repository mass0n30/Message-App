
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import ChatBody  from '../components/ChatBody';
import { use } from 'react';


{/*maybe import local styles */}

function HomePage() {
  const { user, users, chatRooms, currentRoom, setCurrentRoom, loading, mount, setMount, setLoading, setSuccess, authRouter, setError, guestMode, setAlertGuest
    , toggleMessages, setToggleMessages, setFriends, setUserMessages, messageContent, setMessageContent, setToggleDirectMessage, alertWelcome, setAlertWelcome
   } = useOutletContext();



   return (
    <>
    {alertWelcome && (
      <div className="welcome-alert">
        Welcome back, <i>{user ? user.alias : "Guest"}</i>!
      </div>
    )}
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
      />
    </> 
  )
}

export default HomePage;