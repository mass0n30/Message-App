
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/components/navbar.module.css';
import messageBoxStyles from '../styles/components/messagesbox.module.css';
import Cluster from '../primitives/Cluster';
import { MailWarning, Mail, CircleUserRound, LucideLogOut } from 'lucide-react';

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
      <div className={styles.logo}>
        <h1>PulseChat</h1>
        <div className={styles.logoImageContainer}>
          <img src='/logo.png' alt='logo' className={styles.logoImage} />
        </div>
      </div>
      <Cluster>
        <div className={styles.navLinks}>
          <button onClick={handleLogOut}><LucideLogOut size={32} strokeWidth={2.5} /></button>
        </div>
        <div className={styles.navLinks}>
          <button onClick={handleNavigateProfile}><CircleUserRound size={32} strokeWidth={2.5} /></button>
        </div>
        <div className={styles.navLinks}>
          <button onClick={handleNavigateMessages} className={messageBoxStyles.pendingMessagesBtn}>
            {newMsgCount > 0 ? 
            <div><MailWarning size={32} strokeWidth={2.5} /></div>
              : <div><Mail size={32} strokeWidth={2.5} /></div>}
            {newMsgCount > 0 && <div className={messageBoxStyles.pendingCount}>{newMsgCount}</div>}
          </button>
        </div>
      </Cluster>

    </nav>
  )
}

export default Navbar;