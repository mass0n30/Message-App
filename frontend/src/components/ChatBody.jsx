import styles from '../styles/components/chatbody.module.css';
import { useEffect, useState } from 'react';

export default function ChatBody(props) {

  const { SetMount, mount, SetNewFetch, user, SetCurrentRoom, 
  currentRoom, authRouter, SetError } = props;

  const [ messageContent, setMessageContent ] = useState("");
  const [ loading, SetLoading ] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      SetLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  } ,[loading]);


  const userId = user.id;
  const roomId = currentRoom.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authRouter.post(`/chats/${currentRoom.id}/message`, {
        content: messageContent,
        userId: userId,
        roomId: roomId
      });
      const result = await response.data;
      SetCurrentRoom(result.updatedChatRoom);
    } catch (error) {
      SetError(error)
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
      <div className="messages">
       { currentRoom && (
          currentRoom.messages && currentRoom.messages.length > 0 ? (
            currentRoom.messages.map((message) => (
              <div key={message.id} className={message.senderId === user.id ? styles.ownMessage : styles.message}>
                <strong>{message.sender.alias}:</strong> {message.content}
              </div>
            ))) : (
              <p>No messages in this chat room.</p>
            ))
        }
      </div>
      <div className="input-area">
        <form
          onSubmit={handleSubmit}
          method="POST"
          id="messageForm"
          autoComplete="off"
        >
          <input type="text" placeholder="Type your message..."
          onChange={(e) => setMessageContent(e.target.value)} />
          <button>Send</button>
        </form>

      </div>
    </div>
  );
}
