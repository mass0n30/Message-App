import styles from '../styles/components/messagesbox.module.css';
import { useState } from 'react';

function MessagesBox({ messages, SetMessages, toggleMessages, authRouter, user, SetUser }) {

  const [toggledMessageId, setToggledMessageId] = useState(null);
  const [messageContent, setMessageContent] = useState(null);

  const handleToggleMessage = (msgId) => {

    setToggledMessageId(toggledMessageId === msgId ? null : msgId);

    const messageToUpdate = messages.find(msg => msg.id === msgId);

    // updating message if 'read' also getting currently viewed message directs
    if (messageToUpdate) {
      authRouter.get(`${import.meta.env.VITE_API_URL}/friends/chats/read/${msgId}`)
      .then(response => {
        const messages = response.data;
        setMessageContent(messages.currentViewedMessages)
      })
      .catch(error => {
        console.error("Error updating message status:", error);
      });
    }
  }

  return (
    <div className={styles.messagesBox}
      style={{ display: toggleMessages ? 'block' : 'none' }}
    >
      <h2>Messages Box</h2>
      {messages.map((msg, index) => (
        <div key={index}>
          <button style={{ backgroundColor: msg.read ? 'lightgray' : 'white' }} 
          onClick={() => handleToggleMessage(msg.id)}
          className={styles.messageButton}
          >
            <strong>{msg.sender.alias}: {messages[index]?.content}</strong>
          </button>
          {toggledMessageId !== null && <p></p>}
        </div>
      ))}
    </div>
  );
}

export default MessagesBox;