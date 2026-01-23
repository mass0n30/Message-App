
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
    <>
      <div>Navbar Text</div>
      <button onClick={handleLogOut}>Log Out</button>
      <button onClick={() => navigate("/home/profile")}>Profile</button>
    </>
  )
}

export default Navbar;