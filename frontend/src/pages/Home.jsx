{/* import { useState, useEffect } from 'react' */}
import { useParams, Outlet } from "react-router-dom";
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SideBar from "../components/Sidebar";
import axios from "axios";

function Home() {

  const [user, SetUser] = useState(null);
  const [users, SetUsers] = useState(null);
  const [chatRooms, SetChatRooms] = useState(null);
  const [currentRoom, SetCurrentRoom] = useState(null);
  // loading state settings
  const [mount, SetMount] = useState(true);
  const [loading, SetLoading] = useState(true);
  const [success, SetSuccess] = useState(false);
  const [error, SetError] = useState(null);
  const token = localStorage.getItem('usertoken');
  // console.log(token, "tested");

  // for protected routes with token
  const authRouter = axios.create({
    baseURL: 'http://localhost:5000/',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', 
    }
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
        SetUser(result.allData.userData); 
        SetUsers(result.allData.users);
        SetChatRooms(result.allData.chatRooms);
        SetCurrentRoom(result.allData.chatRooms[0]); // default to Global chatroom
      } catch (error) {
        SetError(error);
      }
    };
    fetchUser();
  }, [token]);  // token dependency?

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  // loader sidebar/ navbar / ect
  if (loading  || !user) {
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
        <Outlet context={{user, users, chatRooms, currentRoom, SetCurrentRoom, loading, mount, SetMount, success, SetLoading, SetSuccess, authRouter, SetError }} />
      <Footer/>
    </>


  )
}

export default Home;