
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/components/navbar.module.css';


function Navbar() {
  const navigate = useNavigate();
  
  function handleLogOut() {
  localStorage.removeItem("usertoken");
  navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <h1>Navbar Text</h1>
      </div>
      <div className={styles.navLinks}>
        <button onClick={handleLogOut}>Log Out</button>
        <button onClick={() => navigate("/home/profile")}>Profile</button>
      </div>

    </nav>
  )
}

export default Navbar;