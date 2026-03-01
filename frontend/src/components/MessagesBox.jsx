import styles from '../styles/components/messagesbox.module.css';
import formStyles from '../styles/components/form.module.css';
import SnackBarAlert from './reactMUI/Alerts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Message from './Message';

function MessagesBox({ toggleMessages, authRouter, user, friends, setMount, messages, pendingMessages, setUserMessages,
  messageContent, setMessageContent, guestMode, setAlertGuest, setToggleMessages, toggleDirectMessage, setToggleDirectMessage
 }) {

  const [directMessage, setDirectMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertRead, setAlertRead] = useState(false);
  const [togglePending, setTogglePending] = useState(false);
  const [toggledFriendId, setToggledFriendId] = useState(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [messageContent, messages]);
      
  

  const handleToggleMessage = async (friendId, toggle) => {

    toggle && setToggleDirectMessage(true);
    setToggledFriendId(friendId);

    authRouter.put(`${import.meta.env.VITE_API_URL}/friends/chats/read/${friendId}`)
    .then( response => {
      const data = response.data;
      
      setMount(true);
      setMessageContent(data.updatedMessages);
      !toggle && setAlertRead(true);

    })
    .catch(error => {
      console.error("Error updating message status:", error);
    });
    
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    if (!directMessage || directMessage.trim() === '' || toggledFriendId === null) return;

    try {
      const response = await authRouter.post(`${import.meta.env.VITE_API_URL}/friends/chats/private/${toggledFriendId}`, {
        userId: user.id,
        friendId: toggledFriendId,
        content: directMessage
      });
      const result = await response.data;
      setMessageContent(result.updatedMessages);
      setAlertSuccess(true);
      setDirectMessage('');
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

  if (toggleDirectMessage === true) {
    return (
      <div className={styles.messagesBox}
        style={{ display: toggleMessages ? 'block' : 'none' }}
      >
        <h2>Messages Box</h2>
      {/* Show toggled messages*/}
        {messageContent !== null && (
          <div className={styles.messageContent}>
            <div onClick={() => setToggleDirectMessage(false)}>  
              <button type="button">Friends List</button>
            </div>

            {(() => {
                let lastDay = null;

                return messageContent?.map((message) => {
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
                      setToggleMessages={setToggleMessages}
                      showDayHeader={showDayHeader}
                    />
                  );
                });
              })()}
          </div>
        )}
        <div>
          <form className={formStyles.formContainer} onSubmit={handleSubmitMessage}>
            <input type="text" placeholder="Send Message" value={directMessage} onChange={(e) => setDirectMessage(e.target.value)} />
            <button type="submit">Send</button>
          </form>
        </div>
        <SnackBarAlert setOpen={setAlertSuccess} open={alertSuccess} msg={'Message sent successfully!'} />
        <SnackBarAlert setOpen={setAlertRead} open={alertRead} msg={'Messages marked as read!'} />
      </div>
      );
  }

  return (
    <div className={styles.messagesBox}
      style={{ display: toggleMessages ? 'block' : 'none' }}
    >
      <h2>Messages Box</h2>
      {/* Show friends list only if user has friends and no messages are currently toggled */}
      {user && friends?.length > 0 && toggleDirectMessage === false && (
        
        <div className={styles.friendsList}>
          <h3>Friends</h3>
          {friends.map((friend) => {
            const sent = friend?.friendsOf?.sentMessages || [];
            const hasNewMessages = sent.some((msg) => !msg.read);

            return (
              <div key={friend.id} className={styles.friendItem}>
                <button
                  className={styles.friendItemBtn}
                  onClick={() => handleToggleMessage(friend?.friendsOf?.id, true)}
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
      {pendingMessages && pendingMessages?.length > 0 ? (
        <div className={styles.pendingMessages}>
          <div >
            <button onClick={() => setTogglePending(!togglePending)} className={styles.pendingMessagesBtn}>
              <div>Pending Messages</div><div className={styles.pendingCount}>{pendingMessages.length}</div>
            </button>
          </div>
          {togglePending && (
              (() => {
                let lastDay = null;

                return pendingMessages.map((message) => {
                  const day = new Date(message.timestamp).toISOString().slice(0, 10);
                  const showDayHeader = day !== lastDay;
                  if (showDayHeader) {
                    lastDay = day;
                  }
    
                  return (
                    <div key={message.id} className={styles.pendingMessageItem}>
                      <Message
                        key={message.id}
                        user={user}
                        msg={message}
                        guestMode={guestMode}
                        setAlertGuest={setAlertGuest}
                        setToggleMessages={null}
                        showDayHeader={showDayHeader}
                      />
                      <div className={styles.messageMarkRead}>
                        <button onClick={() => handleToggleMessage(message.sender.id)}>Mark as Read</button>
                      </div>
                      <div className={styles.messageDelete}>
                        <button onClick={() => handleToggleMessage(message.sender.id, true)}>Message</button>
                      </div>
                    </div>
                  );
                });
              })()
            )} 
          </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default MessagesBox;