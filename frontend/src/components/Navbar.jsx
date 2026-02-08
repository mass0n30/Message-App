
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/components/navbar.module.css';
import Cluster from '../primitives/Cluster';


function Navbar({setMount, guestMode, SetAlertGuest}) {
  const navigate = useNavigate();

  function handleNavigateMessages() {
    if (guestMode) {
      SetAlertGuest(true);
      return;
    }
  };

  function handleNavigateProfile() {
    if (guestMode) {
      SetAlertGuest(true);
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
          <button onClick={handleNavigateMessages}>Messages</button>
        </div>
      </Cluster>

    </nav>
  )
}

export default Navbar;