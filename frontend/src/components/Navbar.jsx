
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/components/navbar.module.css';
import Cluster from '../primitives/Cluster';


function Navbar({setMount, guestMode, setAlertGuest, user, friends, setToggleMessages, toggleMessages, messages}) {
  const navigate = useNavigate();

  const newMsgCount = user && messages ? messages.filter(msg => !msg.read).length : 0;

  function handleNavigateMessages() {
    if (guestMode) {
      setAlertGuest(true);
      return;
    }
    setToggleMessages(!toggleMessages);
  };

  function handleNavigateProfile() {
    if (guestMode) {
      setAlertGuest(true);
      return;
    } else {
      navigate("/home/profile");
    }
  };

    function handleLogOut() {
    localStorage.removeItem("usertoken");
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <Cluster>
        <div className={styles.logo}>
          <h1>Navbar Text</h1>
        </div>
        <div className={styles.navLinks}>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
        <div className={styles.navLinks}>
          <button onClick={handleNavigateProfile}>Profile</button>
        </div>
        <div className={styles.navLinks}>
          <button onClick={handleNavigateMessages}>Messages {newMsgCount > 0 && <span style={{ color: 'red' }}>({newMsgCount})</span>}</button>
        </div>
      </Cluster>

    </nav>
  )
}

export default Navbar;