import { useEffect, useState } from "react";
import{ useNavigate } from "react-router-dom";
import styles from '../styles/components/sidebar.module.css';
import axios from "axios";

function SideBar(props) {
  const {chatRooms, currentRoom, SetChatRooms, SetCurrentRoom, loading, success, SetLoading, authRouter, SetAlertGuest, guestMode } = props;

  const [toggle, setToggle] = useState(false);
  const [roomName, setRoomName] = useState("");

  const navigate = useNavigate();

  const handleSetRoom = (roomId) => {

    if (currentRoom?.id !== roomId) {
      SetLoading(true);
    }

    const selectedRoom = chatRooms.find((room) => room.id === roomId);

    if (selectedRoom) {
      SetCurrentRoom(selectedRoom);
      navigate('/home');
    }
  };

  const handleCreateRoom = () => {
    if (guestMode) {
      SetAlertGuest(true);
      return;
    } 

    if (!toggle) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  const handleSubmitCreateRoom = async (roomName) => {
    if (!roomName || roomName.trim() === "") return;

    try {
      const response = await authRouter.post(`${import.meta.env.VITE_API_URL}/chats/`, { roomName: roomName });
      const result = await response.data;
      SetChatRooms(result.allData.chatRooms);
      SetCurrentRoom(result.chatRoom); 
      navigate('/home');
    } catch (error) {
      console.error("Error creating room:", error);
    }
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
          <div>
            <button onClick={() => handleCreateRoom()}>{toggle ? "Cancel" : "Add Room"}</button>
          </div>
          {toggle && (
            <div>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmitCreateRoom(roomName);
              }}>
                <input 
                  type="text" 
                  placeholder="Room Name" 
                  value={roomName}    
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <button type="submit">Create</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SideBar;