import { ImagePlus, ImageMinus } from 'lucide-react';
import styles from '../../styles/components/messagesbox.module.css';
import { useState } from 'react';
import FileForm from '../UI/FileForm';

function SendMessage({ handleSubmit, messageContent, setMessageContent, file, setFile }) {

  const [fileToggle, setFileToggle] = useState(false);

  const handleUploadFile = () => {

    {!fileToggle && setFileToggle(true);}
    {fileToggle && setFileToggle(false);}

    // clear uploaded file in file state when closing file form
    if (fileToggle) {

      setFile(null);
    }
  }

  return (
    <div className={styles.sendMessageContainer}>
      <div className={styles.sendMessageFormContainer}>
        <form
          onSubmit={handleSubmit}
          method="POST"
          className={styles.formContainer}
          autoComplete="off"
        >
          <input type="text" placeholder="Type your message..." 
          className={styles.messageInput}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)} />
            <button type="button" className={styles.attachmentButton} onClick={() => handleUploadFile()}>
              { fileToggle ? <ImageMinus className={styles.attachmentIconX} strokeWidth={2.5} /> :
              <ImagePlus className={styles.attachmentIcon} strokeWidth={2.5} />
        }
            </button>
          <button className={styles.sendButton}>Send</button>
        </form>
      </div>
      {fileToggle && (
        <FileForm file={file} setFile={setFile} fileToggle={fileToggle} setFileToggle={setFileToggle} handleUploadFile={handleUploadFile} />
      )}
    </div>
  )
}

export default SendMessage;