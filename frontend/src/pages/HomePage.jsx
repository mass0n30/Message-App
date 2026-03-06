
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import ChatBody  from '../components/chat/ChatBody';


{/*maybe import local styles */}

function HomePage() {
  const { user, users, chatRooms, currentRoom, setCurrentRoom, loading, mount, setMount, setLoading, setSuccess, authRouter, authRouterForm, setError, guestMode, setAlertGuest
    , toggleMessages, setToggleMessages, setFriends, setUserMessages, messageContent, setMessageContent, setToggleDirectMessage, alertWelcome, messageFile, setMessageFile,
    fileToggle, setFileToggle
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
        authRouterForm={authRouterForm}
        setError={setError}
        guestMode={guestMode}
        setAlertGuest={setAlertGuest}
        messageFile={messageFile}
        setMessageFile={setMessageFile}
        fileToggle={fileToggle}
        setFileToggle={setFileToggle}
      />
    </> 
  )
}

export default HomePage;