import styles from '../../styles/components/chatbody.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowDownUp, ArrowUpDown } from 'lucide-react';
import SendMessage from './SendMessage';
import Message from './Message';
import FileForm from '../UI/FileForm';

export default function ChatBody(props) {

  const { setMount, mount, setNewFetch, user, setCurrentRoom, 
  currentRoom, authRouter, authRouterForm, setError, setToggledFriendId, toggledFriendId,
  guestMode, setAlertGuest, messageFile, setMessageFile, fileToggle, setFileToggle } = props;

  const [ messageContent, setMessageContent ] = useState(null);
  const [order, setOrder] = useState(true);
  const [ loading, SetLoading ] = useState("");
  // attached file preview state
  const [preview, setPreview] = useState(null);

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

    const formData = new FormData();
    formData.append("content", messageContent);
    formData.append("userId", userId);
    formData.append("roomId", roomId);
    if (messageFile) {
      formData.append("file", messageFile);
      SetLoading(true);
    }

    // conditional - if file, use multer form data, else use json body
    try {
      if (!messageFile) {
        const response = await authRouter.post(`/chats/${currentRoom.id}/message`, {
          content: messageContent,
          userId,
          roomId,
        });
        const result = await response.data;
        setCurrentRoom(result.updatedChatRoom);
        setMessageContent("");
        setMessageFile(null);
      } else {
        const formData = new FormData();
        formData.append("content", messageContent);
        formData.append("userId", String(userId));
        formData.append("roomId", String(roomId));
        formData.append("file", messageFile);

        const response = await authRouterForm.post(`/chats/${currentRoom.id}/message`, formData);
        const result = await response.data;
        setMessageContent("");
        setMessageFile(null);
        setCurrentRoom(result.updatedChatRoom);
      }
    } catch (error) {
      setError(error)
    } finally {
      setMessageFile(null);
      setFileToggle(false);
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
          file={messageFile}
          setFile={setMessageFile}
          fileToggle={fileToggle}
          setFileToggle={setFileToggle}
          preview={preview}
          setPreview={setPreview}
        />
      </div>
        <div className={styles.avatarContainer}>

        {fileToggle && 
      
          <div className={styles.avatarControlBtns}>
            <button className={styles.closeModalButton} onClick={() => setFileToggle(false)}><XCircle className={styles.closeIcon} /></button>
          </div>
        }
          {fileToggle && 
            <FileForm file={messageFile} setFile={setMessageFile} fileToggle={fileToggle} setFileToggle={setFileToggle} handleUploadFile={handleSubmit} 
            preview={preview} setPreview={setPreview} />
          }
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
