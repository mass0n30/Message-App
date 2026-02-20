import styles from '../styles/components/messagesbox.module.css';
import formStyles from '../styles/components/form.module.css';
import SnackBarAlert from './reactMUI/Alerts';
import { useState, useEffect } from 'react';

function MessagesBox({ toggleMessages, authRouter, user, friends, SetFriends, messages, SetUserMessages, toggledFriendId, setToggledFriendId,
  messageContent, setMessageContent
 }) {

  const [directMessage, setDirectMessage] = useState('');
  const [loading, SetLoading] = useState(true);
  const [alertSuccess, SetAlertSuccess] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      SetLoading(false);
    }, 2000);
  }, [messageContent]);
      
  

  const handleToggleMessage = async (friendId) => {

    setToggledFriendId(toggledFriendId === friendId ? null : friendId);

    authRouter.put(`${import.meta.env.VITE_API_URL}/friends/chats/read/${friendId}`)
    .then( response => {
      const data = response.data;
      setMessageContent(data.currentViewedMessages);
      SetFriends(data.updatedFriends);
      SetUserMessages(data.updatedMessages);

    })
    .catch(error => {
      console.error("Error updating message status:", error);
    });
    
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    if (!messageContent || messageContent.trim() === '') return;

    try {
      const response = await authRouter.post(`friends/chats/private/${toggledFriendId}`, {
        userId: user.id,
        friendId: toggledFriendId,
        content: messageContent
      });
      const result = await response.data;
      SetAlertSuccess(true);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };



  if (loading) {
    return (
      <div className={styles.messagesBox}
        style={{ display: toggleMessages ? 'block' : 'none' }}
      >
        <h2>Messages Box</h2>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (messageContent !== null) {
    return (
      <div className={styles.messagesBox}
        style={{ display: toggleMessages ? 'block' : 'none' }}
      >
        <h2>Messages Box</h2>
      {/* Show toggled messages*/}
        {messageContent !== null && (
          <div className={styles.messageContent}>
            <div onClick={() => setMessageContent(null)}>  
              <button type="button">Messages</button>
            </div>
            {messageContent.map((msg) => (
          
              <div key={msg.id} className={styles.messageItem}
                style={{ backgroundColor: msg.read ? '#f0f0f013' : '#fcff3ca1', borderBottom: msg.read ? '1px solid #ccc' : '1px solid #ff0000' }}
              >
                <div className={styles.messageText}>{msg.sender.alias}: {msg.content}</div>
                <div className={styles.messageTimestamp}>{new Date(msg.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
        <div>
          <form className={formStyles.formContainer} onSubmit={handleSubmitMessage}>
            <input type="text" placeholder="Send Message" onChange={(e) => setMessageContent(e.target.value)} />
            <button type="submit">Send</button>
          </form>
        </div>
        <SnackBarAlert setOpen={SetAlertSuccess} open={alertSuccess} msg={'Message sent successfully!'} />
      </div>
      );
  }

  return (
    <div className={styles.messagesBox}
      style={{ display: toggleMessages ? 'block' : 'none' }}
    >
      <h2>Messages Box</h2>
      {/* Show friends list only if user has friends and no messages are currently toggled */}
      {user && friends.length > 0 && messageContent === null && (
        
        <div className={styles.friendsList}>
          <h3>Friends</h3>
          {friends.map((friend) => {
            const sent = friend?.friendsOf?.sentMessages || [];
            const hasNewMessages = sent.some((msg) => !msg.read);

            return (
              <div key={friend.id} className={styles.friendItem}>
                <button
                  className={styles.friendItemBtn}
                  onClick={async () => handleToggleMessage(friend?.friendsOf?.id)}
                >
                  {friend?.friendsOf?.alias}

                  {hasNewMessages ? (
                    <div className={styles.newMessage}>New Message</div>
                  ) : (
                    <div className={styles.noMessage}>View Messages</div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MessagesBox;