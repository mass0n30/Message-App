{/* import { useState, useEffect } from 'react' */}
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SideBar from "../components/Sidebar";
import axios from "axios";

function Home() {

  const [user, SetUser] = useState(null);
  const [users, SetUsers] = useState(null);
  const [guestMode, SetGuestMode] = useState(false);
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


  //spinner upon mount with delay, post creation message with delay
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

        //console.log(result.allData, "home data");
        // setting all non sensitive user data

        SetUser(result.userData); 
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
     if (token) {
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
      <>
      <Navbar/>
        <aside> 
        </aside>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <div className="spinner"></div>
        </div>
      <Footer/>
      </>
    );
  }

  return (
    <>
      <Navbar/>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
      <aside>
          <SideBar 
            chatRooms={chatRooms}
            currentRoom={currentRoom}
            SetCurrentRoom={SetCurrentRoom}
            SetMount={SetMount}
            mount={mount}
            loading={loading}
            success={success}
            SetLoading={SetLoading}
            authRouter={authRouter}
            SetError={SetError}
          />
        </aside>
        <main>
          <Outlet context={{user, users, chatRooms, currentRoom, SetCurrentRoom, loading, mount, SetMount, success, SetLoading, SetSuccess, authRouter, SetError }} />
        </main>
      </div>
      <Footer/>
    </>


  )
}

export default Home;