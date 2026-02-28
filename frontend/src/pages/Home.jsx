{/* import { useState, useEffect } from 'react' */}
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Shell from "../primitives/Shell";
import Stack from "../primitives/Stack";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SideBar from "../components/Sidebar";
import MessagesBox from "../components/MessagesBox";
import axios from "axios";
import SnackBarAlert from "../components/reactMUI/Alerts";
import { getPendingMessages } from "../../utils/helpers";

function Home() {

  // state settings
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [userMessages, setUserMessages] = useState(null);
  const [guestMode, setGuestMode] = useState(false);
  const [alertGuest, setAlertGuest] = useState(false);
  const [friends, setFriends] = useState(false);
  const [chatRooms, setChatRooms] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  // message box toggle settings
  const [toggleMessages, setToggleMessages] = useState(false);
  const [toggleDirectMessage, setToggleDirectMessage] = useState(false);
  const [pendingMessages, setPendingMessages] = useState(false);
  const [toggledFriendId, setToggledFriendId] = useState(null);
  const [messageContent, setMessageContent] = useState([]);
  // loading state settings
  const [mount, setMount] = useState(true);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('usertoken');

  const navigate = useNavigate();

  // for protected routes with token
  const authRouter = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', 
      },
  });

  // for multer form data (file (avatar img) uploads)
  const authRouterForm = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', 
      },
  });


  // spinner upon mount with delay, post creation message with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const successTimer = setTimeout(() => {
      setSuccess(false);
    }, 5000);


    return () => clearTimeout(timer, successTimer); 
  } ,[loading, setSuccess, setLoading]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authRouter.get('/home');
        const result = await response.data;

        // console.log(result.allData, "home data");
        // setting all non sensitive user data

        setUser(result.userData); 
        setFriends(result.userData.userFriendships);
        setUserMessages(result.userData.receivedMessages);
        const pendingMessages = getPendingMessages(result.userData.userFriendships, result.userData.receivedMessages);
        setPendingMessages(pendingMessages);
        setUsers(result.allData.users);
        setChatRooms(result.allData.chatRooms);
        setCurrentRoom(result.allData.chatRooms[0]); // default to Global chatroom
      } catch (error) {
        setError(error);
      }
    };

    const fetchGuestMode = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/home/guest`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', 
          },
        });
        if (!response.ok) {
          navigate('/');

          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        setGuestMode(true);
        setUsers(result.allData.users);
        setChatRooms(result.allData.chatRooms);
        setCurrentRoom(result.allData.chatRooms[0]); // default to Global chatroom

        // reset boolean fetch after updated posts fetch
      } catch (error) {
        setError(error);
      } 
    };

    // cleanup for mount, used to update userProfile from user changes
    const timer = setTimeout(() => {
      setMount(false);
    }, 2000);


    // initiate GET home fetch if there's a token else continue guest mode
     if (token && !user || token && user) {
      fetchUser();
     } else {
      fetchGuestMode();
     }
     return () => clearTimeout(timer); 


  }, [token, mount]);  // token dependency?

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  // loader sidebar/ navbar / ect
  // replace all this with loader in future, just testing loading state here
  if (loading) {
    return (
      <Shell>
        <Stack>

            <div className="contentWrapper" style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
              <div className="spinner">Loading...</div>
            </div>
          <Footer/>
        </Stack>
      </Shell>
    );
  }

  return (
    <Shell>
      <Stack>
        <Navbar
          setMount={setMount}
          guestMode={guestMode}
          setAlertGuest={setAlertGuest}
          user={user}
          messages={userMessages}
          setToggleMessages={setToggleMessages}
          toggleMessages={toggleMessages}

        />
        <div className="contentWrapper" style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
        <aside>
            <SideBar 
              chatRooms={chatRooms}
              currentRoom={currentRoom}
              setCurrentRoom={setCurrentRoom}
              setChatRooms={setChatRooms}
              setMount={setMount}
              mount={mount}
              loading={loading}
              success={success}
              setLoading={setLoading}
              authRouter={authRouter}
              setError={setError}
              setAlertGuest={setAlertGuest}
              guestMode={guestMode}
              user={user}
            />
          </aside>
          <MessagesBox
            authRouter={authRouter}
            user={user}
            messages={userMessages}
            toggleMessages={toggleMessages}
            pendingMessages={pendingMessages}
            setFriends={setFriends}
            friends={friends}
            setUserMessages={setUserMessages}
            toggledFriendId={toggledFriendId}
            setToggledFriendId={setToggledFriendId}
            messageContent={messageContent}
            setMessageContent={setMessageContent}
            setToggleMessages={setToggleMessages}
            guestMode={guestMode}
            setAlertGuest={setAlertGuest}
            toggleDirectMessage={toggleDirectMessage}
            setToggleDirectMessage={setToggleDirectMessage}
            mount={mount}
            setMount={setMount}
          />
          <main>
            <SnackBarAlert setOpen={setAlertGuest} open={alertGuest} msg={'Signup for User Features'}/>
            <Outlet context={{user, setUser, users, chatRooms, currentRoom, setCurrentRoom, loading, mount, setMount, success, setLoading, setSuccess, authRouter, authRouterForm, setError, guestMode, setAlertGuest
            ,toggleMessages, setToggleMessages, setToggledFriendId, toggledFriendId, setFriends, setUserMessages: setUserMessages, messageContent, setMessageContent, setToggleDirectMessage }} />
          </main>
        </div>
        <Footer/>
      </Stack>
    </Shell>


  )
}

export default Home;