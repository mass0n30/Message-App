import styles from '../../styles/components/chatbody.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowDownUp, ArrowUpDown } from 'lucide-react';
import SendMessage from './SendMessage';
import Message from './Message';

export default function ChatBody(props) {

  const { setMount, mount, setNewFetch, user, setCurrentRoom, 
  currentRoom, authRouter, setError, setToggledFriendId, toggledFriendId, guestMode, setAlertGuest } = props;

  const navigate = useNavigate();

  const [ messageContent, setMessageContent ] = useState(null);
  const [fileToggle, setFileToggle] = useState(false);
  const [file, setFile] = useState(null);
  const [addedFileToggle, setAddedFileToggle] = useState(false);
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
      setAddedFileToggle(false);
      setFile(null);
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
          file={file}
          setFile={setFile}
          addedFileToggle={addedFileToggle}
          setAddedFileToggle={setAddedFileToggle}
        />

      </div>
        <div className={styles.avatarContainer}>

        {fileToggle && 
      
          <div className={styles.avatarControlBtns}>
            <button className={styles.closeModalButton} onClick={() => setFileToggle(false)}><XCircle className={styles.closeIcon} /></button>
          </div>
        }
          {fileToggle && (
          <div className={styles.addFileModalContent}>
            <label>Add a File</label>

            <form onSubmit={(e) => {
              e.preventDefault();
              setAddedFileToggle(true);
            }}>
              <input type="file" name="avatar" className={styles.fileInput} onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <button type="submit">Add</button>
            </form>

          </div>
          )}
        </div>
        <div className={styles.orderToggle} >
          {order ? <ArrowDownUp className={styles.arrow} onClick={() => setOrder(!order)} /> : <ArrowUpDown className={styles.arrow} onClick={() => setOrder(!order)} />}
        </div>
        <div className={styles.messagesContainer}>
          <div className={order ? styles.messages : styles.messagesReversed}>

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
    </div>
  );
}
