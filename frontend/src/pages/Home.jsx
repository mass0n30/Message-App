{/* import { useState, useEffect } from 'react' */}
import { useParams, Outlet } from "react-router-dom";
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SideBar from "../components/Sidebar";

function Home() {

  const [user, SetUser] = useState(null);
  const [users, SetUsers] = useState(null);
  const [chatRooms, SetChatRooms] = useState(null);
  const [currentRoom, SetCurrentRoom] = useState(null);
  // loading state settings
  const [fetched, SetNewFetch] = useState(false);
  const [loading, SetLoading] = useState(true);
  const [success, SetSuccess] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('usertoken');
  console.log(token, "tested");

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
        const response = await fetch('http://localhost:5000/home', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        //console.log(result.allData, "home data");
        // setting all non sensitive user data
        SetUser(result.allData.userData); 
        SetUsers(result.allData.users);
        SetChatRooms(result.allData.chatRooms);
        SetNewFetch(false);
      } catch (error) {
        setError(error);
      } 
    };
    fetchUser();
  }, [token, fetched]);  // token dependency?

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  if (loading  || !user) {
    return (
      <>
      <Navbar/>
        <aside>
          <SideBar 
            chatRooms={chatRooms}
            loading={loading}
            success={success}
            SetLoading={SetLoading}
          />
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
            loading={loading}
            success={success}
            SetLoading={SetLoading}
          />
        </aside>
        <Outlet context={{user, users, chatRooms, currentRoom, SetCurrentRoom, loading, success, SetLoading, SetSuccess, SetNewFetch, }} />
      <Footer/>
    </>


  )
}

export default Home;