import styles from '../styles/components/chatbody.module.css';
import { useEffect, useState } from 'react';

export default function ChatDirect(props) {

  const { SetMount, mount, SetNewFetch, user, SetCurrentRoom, 
  currentRoom, authRouter, SetError } = props;

  const [ messageContent, setMessageContent ] = useState("");
  const [ loading, SetLoading ] = useState(true);
  const [ messages, setMessages ] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      SetLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  } ,[loading]);



  if (loading) {
    return (
      <div className={styles.chatBody}>
        <div className="spinner">Loading....</div>
      </div>
    );
  }

return (
  <>



  <div className={styles.chatBody}>
    <div className={styles.messages}>
      {messages.map((msg) => (
        <div key={msg.id} className={styles.message}>
          <span className={styles.user}>{msg.user}</span>: {msg.text}
        </div>
      ))}
    </div>
  </div>
  </>
)

}