import { useEffect } from "react";
import styles from '../styles/components/sidebar.module.css';

function SideBar(props) {
  const {chatRooms, currentRoom, SetCurrentRoom, loading, success, SetLoading } = props;


  const handleSetRoom = (roomId) => {
    if (currentRoom.id !== roomId) {
      SetCurrentRoom(roomId);
    }
  };


  if (loading) {
    return (
      <div className={styles.sidebar}>

      </div>
    );
  }

  return (
    <div className={styles.sidebar}>
      <h2>Sidebar</h2>
      {chatRooms && chatRooms.length > 0 && (
        <div>
          {chatRooms.map((room) => (
            <button key={room.id} onClick={() => handleSetRoom(room.id)} >{room.id}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SideBar;