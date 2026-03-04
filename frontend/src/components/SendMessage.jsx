import { ImagePlus } from 'lucide-react';
import styles from '../styles/components/messagesbox.module.css';

function SendMessage({ handleSubmit, messageContent, setMessageContent }) {

  const handleUploadFile = () => {
    // Logic for handling file upload
  };

  return (
    <div className={styles.sendMessageContainer}>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className={styles.formContainer}
        autoComplete="off"
      >
        <input type="text" placeholder="Type your message..."
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)} />
          <button type="button" className={styles.attachmentButton} onClick={() => handleUploadFile()}>
            <ImagePlus size={20} strokeWidth={2.5} />
          </button>
        <button>Send</button>
      </form>
    </div>
  )
}

export default SendMessage;