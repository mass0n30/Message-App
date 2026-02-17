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

function Home() {

  const [user, SetUser] = useState(null);
  const [users, SetUsers] = useState(null);
  const [userMessages, SetUserMessages] = useState(null);
  const [guestMode, SetGuestMode] = useState(false);
  const [alertGuest, SetAlertGuest] = useState(false);
  const [friends, SetFriends] = useState(false);
  const [chatRooms, SetChatRooms] = useState(null);
  const [currentRoom, SetCurrentRoom] = useState(null);
  // loading state settings
  const [mount, SetMount] = useState(true);
  const [loading, SetLoading] = useState(true);
  const [success, SetSuccess] = useState(false);
  const [error, SetError] = useState(null);
  const token = localStorage.getItem('usertoken');
  // console.log(token, "tested");

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
      SetLoading(false);
    }, 2000);

    const successTimer = setTimeout(() => {
      SetSuccess(false);
    }, 5000);
    return () => clearTimeout(timer, successTimer); 
  } ,[loading, SetSuccess, SetLoading]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authRouter.get('/home');
        const result = await response.data;

        // console.log(result.allData, "home data");
        // setting all non sensitive user data

        SetUser(result.userData); 
        SetFriends(result.userData.userFriendships);
        SetUsers(result.allData.users);
        SetChatRooms(result.allData.chatRooms);
        SetCurrentRoom(result.allData.chatRooms[0]); // default to Global chatroom
      } catch (error) {
        SetError(error);
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

        SetGuestMode(true);
        SetUsers(result.allData.users);
        SetChatRooms(result.allData.chatRooms);
        SetCurrentRoom(result.allData.chatRooms[0]); // default to Global chatroom

        // reset boolean fetch after updated posts fetch
      } catch (error) {
        SetError(error);
      } 
    };

    // initiate GET home fetch if there's a token else continue guest mode
     if (token && !user) {
      fetchUser();
     } else {
      fetchGuestMode();
     }

  }, [token]);  // token dependency?

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  // loader sidebar/ navbar / ect
  if (loading) {
    return (
      <Shell>
        <Stack>
          <Navbar
            setMount={SetMount}
            guestMode={guestMode}
            SetAlertGuest={SetAlertGuest}
            user={user}
            messages={userMessages}

          />
            <aside>
                <SideBar 
                  chatRooms={chatRooms}
                  currentRoom={currentRoom}
                  SetCurrentRoom={SetCurrentRoom}
                  SetChatRooms={SetChatRooms}
                  SetMount={SetMount}
                  mount={mount}
                  loading={loading}
                  success={success}
                  SetLoading={SetLoading}
                  authRouter={authRouter}
                  SetError={SetError}
                  SetAlertGuest={SetAlertGuest}
                  guestMode={guestMode}
                  user={user}
                />
              </aside>
            <div className="contentWrapper" style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
              <div className="spinner"></div>
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
          setMount={SetMount}
          guestMode={guestMode}
          SetAlertGuest={SetAlertGuest}
          user={user}
          messages={userMessages}


        />
        <div className="contentWrapper" style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
        <aside>
            <SideBar 
              chatRooms={chatRooms}
              currentRoom={currentRoom}
              SetCurrentRoom={SetCurrentRoom}
              SetChatRooms={SetChatRooms}
              SetMount={SetMount}
              mount={mount}
              loading={loading}
              success={success}
              SetLoading={SetLoading}
              authRouter={authRouter}
              SetError={SetError}
              SetAlertGuest={SetAlertGuest}
              guestMode={guestMode}
              user={user}
            />
          </aside>

          <main>
            <SnackBarAlert setOpen={SetAlertGuest} open={alertGuest} msg={'Signup for User Features'}/>
            <Outlet context={{user, SetUser, users, chatRooms, currentRoom, SetCurrentRoom, loading, mount, SetMount, success, SetLoading, SetSuccess, authRouter, authRouterForm, SetError, guestMode, SetAlertGuest
             }} />
          </main>
        </div>
        <Footer/>
      </Stack>
    </Shell>


  )
}

export default Home;