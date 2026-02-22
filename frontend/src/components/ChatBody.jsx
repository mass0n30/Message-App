import styles from '../styles/components/chatbody.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Message from './Message';

export default function ChatBody(props) {

  const { setMount, mount, setNewFetch, user, setCurrentRoom, 
  currentRoom, authRouter, setError, setToggledFriendId, toggledFriendId, guestMode, setAlertGuest } = props;

  const navigate = useNavigate();

  const [ messageContent, setMessageContent ] = useState(null);
  const [ loading, SetLoading ] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      SetLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  } ,[loading]);


  const userId = user?.id;
  const roomId = currentRoom?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guestMode) {
      setAlertGuest(true);
      return;
    }

    try {
      const response = await authRouter.post(`/chats/${currentRoom.id}/message`, {
        content: messageContent,
        userId: userId,
        roomId: roomId
      });
      const result = await response.data;
      setCurrentRoom(result.updatedChatRoom);
      setMessageContent("");
    } catch (error) {
      setError(error)
    }
  }


  if (loading) {
    return (
      <div className={styles.chatBody}>
        <div className="spinner">Loading....</div>
      </div>
    );
  }

  return (
    <div>
      {currentRoom?.name && (
        <h2>{currentRoom.name}</h2>
      )}
      <div className={styles.messages}>
        {currentRoom?.messages?.length > 0 ? (
          (() => {
            let lastDay = null;

            return currentRoom.messages.map((message) => {
              const day = new Date(message.timestamp).toISOString().slice(0, 10); 
              const showDayHeader = day !== lastDay;
              if (showDayHeader) {
                lastDay = day;
              }

              return (
                <Message
                  key={message.id}
                  user={user}
                  msg={message}
                  guestMode={guestMode}
                  setAlertGuest={setAlertGuest}
                  setToggleMessages={null}
                  showDayHeader={showDayHeader}
                  setToggledFriendId={setToggledFriendId}
                  toggledFriendId={toggledFriendId}
                />
              );
            });
          })()
        ) : (
          <p>No messages in this chat room.</p>
        )}
      </div>
      <div className="input-area">
        <form
          onSubmit={handleSubmit}
          method="POST"
          id="messageForm"
          autoComplete="off"
        >
          <input type="text" placeholder="Type your message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)} />
          <button>Send</button>
        </form>

      </div>
    </div>
  );
}
