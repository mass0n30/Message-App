import styles from '../styles/components/chatbody.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Message from './Message';
import { Send, ArrowDownUp, ArrowUpDown } from 'lucide-react';
import SendMessage from './SendMessage';


export default function ChatBody(props) {

  const { setMount, mount, setNewFetch, user, setCurrentRoom, 
  currentRoom, authRouter, setError, setToggledFriendId, toggledFriendId, guestMode, setAlertGuest } = props;

  const navigate = useNavigate();

  const [ messageContent, setMessageContent ] = useState(null);
  const [order, setOrder] = useState(true);
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
    <div className={styles.chatBody}
      style={{
        backgroundImage: currentRoom?.pattern ? `url(/pattern/${currentRoom.pattern}.svg)` : 'none',
      }}
    >
      <div className={styles.header}>
        {currentRoom?.name && (
          <h2>{currentRoom.name}</h2>
        )}
        {currentRoom?.topic && (
          <h4>{currentRoom?.topic}</h4>
        )}
      </div>
      <div className={styles.inputContainer}>
        <SendMessage
          handleSubmit={handleSubmit}
          messageContent={messageContent}
          setMessageContent={setMessageContent}
        />

      </div>
      <div className={styles.messages}>
        <div className={styles.orderToggle} onClick={() => setOrder(!order)}>
          {order ? <ArrowDownUp className={styles.arrow} /> : <ArrowUpDown className={styles.arrow} />}
        </div>
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
          <p className={styles.noMessages}>No messages in this chat room.</p>
        )}
      </div>

    </div>
  );
}
