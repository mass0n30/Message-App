import { useState } from "react";
import{ useNavigate } from "react-router-dom";
import styles from '../../styles/components/sidebar.module.css';
import { SquarePlus, X } from "lucide-react";

function SideBar(props) {
  const {chatRooms, currentRoom, setChatRooms, setCurrentRoom, loading, success, setLoading, authRouter, setAlertGuest, guestMode } = props;

  const [toggle, setToggle] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [topic, setTopic] = useState("");
  const [roomPattern, setRoomPattern] = useState("");

  const navigate = useNavigate();

  const handleSetRoom = (roomId) => {

    if (currentRoom?.id !== roomId) {
      setLoading(true);
    }

    const selectedRoom = chatRooms.find((room) => room.id === roomId);

    if (selectedRoom) {
      setCurrentRoom(selectedRoom);
      navigate('/home');
    }
  };

  const handleCreateRoom = () => {
    if (guestMode) {
      setAlertGuest(true);
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

    if (!toggle) {
      setRoomName("");
      setTopic("");
      setRoomPattern("");
      setToggle(true);

    } else {  
      setToggle(false);
    }

    try {
      const response = await authRouter.post('/chats/', { roomName: roomName, topic: topic, pattern: roomPattern });
      const result = await response.data;
      setChatRooms(result.allData.chatRooms);
      setCurrentRoom(result.chatRoom); 
      navigate('/home');
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };


  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>Join Room</h3>
      </div>
      {chatRooms && chatRooms.length > 0 && (
        <div className={styles.chatRoomList}>
          {chatRooms.map((room, index) => (
            <div key={room.id} className={index % 2 === 0 ? styles.chatRoomItem : styles.chatRoomItemAlt} >
              <button onClick={() => handleSetRoom(room.id)} >{room.name}</button>
            </div>
          ))}
          <div className={styles.addRoomButton}>
            <button onClick={() => handleCreateRoom()}>{toggle ? (<div><X className={styles.addRoomIcon} /></div>) : (<div><SquarePlus className={styles.addRoomIcon} /></div>)}</button>
          </div>
          {toggle && (
            <div className={styles.createRoomForm}>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmitCreateRoom(roomName);
              }}>
                <div className={styles.formRow}>
                  <input 
                    type="text" 
                    placeholder="Room Name" 
                    value={roomName}    
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </div>
                <div className={styles.formRow}>
                  <input 
                    type="text" 
                    placeholder="Topic (optional)" 
                    value={topic}    
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className={styles.formRow}>
                  <select value={roomPattern} onChange={(e) => setRoomPattern(e.target.value)}>
                    <option value="" disabled selected hidden>Select your decoration</option>
                    <option value="None">None</option>
                    <option value="FloatingCloud">Floating Cloud</option>
                    <option value="GlowingStars">Glowing Stars</option>
                    <option value="Snow">Snow</option>
                    <option value="Sprinkle">Sprinkle</option>
                    <option value="DashLights">Dash Lights</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Circuit">Circuit</option>
                  </select>
                </div>

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