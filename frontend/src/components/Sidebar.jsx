import { useEffect } from "react";
import{ useNavigate } from "react-router-dom";
import styles from '../styles/components/sidebar.module.css';
import axios from "axios";

function SideBar(props) {
  const {chatRooms, currentRoom, SetCurrentRoom, loading, success, SetLoading, authRouter } = props;

  const navigate = useNavigate();

  const handleSetRoom = (roomId) => {
    if (currentRoom.id !== roomId) {
      const selectedRoom = chatRooms.find((room) => room.id === roomId);
      SetCurrentRoom(selectedRoom);
    }
    navigate('/home');
  };

  useEffect(() => {
    async function fetchRoomData() {
      await authRouter.get(`/chats/${currentRoom.id}`)
        .then((response) => {
          console.log("Room data fetched:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching room data:", error);
        });
    }

    fetchRoomData();
  }  , [currentRoom, SetLoading, success, authRouter]);


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
        <div className={styles.chatRoomList}>
          {chatRooms.map((room) => (
            <div key={room.id} className={styles.chatRoomItem}>
              <button onClick={() => handleSetRoom(room.id)} >{room.name}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SideBar;