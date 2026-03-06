import { ImagePlus, ImageMinus, X } from 'lucide-react';
import formStyles from '../../styles/components/form.module.css';
import { useState } from 'react';
import FileForm from '../UI/FileForm';

function SendMessage({ handleSubmit, messageContent, setMessageContent, file, setFile, fileToggle, setFileToggle,
  preview, setPreview
 }) {

  // attached file preview state

  const handleUploadFile = () => {

    if (fileToggle == false) {
      setFileToggle(true);
    }
  
  }

  return (
    <div className={formStyles.sendMessageContainer}>
      <div className={formStyles.sendMessageFormContainer}>
        <form
          onSubmit={handleSubmit}
          method="POST"
          className={formStyles.sendFormContainer}
          autoComplete="off"
        >
          <input type="text" placeholder="Type your message..." 
          className={formStyles.messageInput}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)} />
            {preview && 
              <button type="button" className={formStyles.previewButton} onClick={() => {
                setPreview(null);
                setFile(null);
              }}>
                <X className={formStyles.xIcon} />
                <img src={preview} className={formStyles.previewImage} alt="preview" />
              </button>
            }
            <button type="button" className={formStyles.attachmentButton} onClick={() => handleUploadFile()}>
              { fileToggle ? <ImageMinus className={formStyles.attachmentIconX} strokeWidth={2.5} /> :
              <ImagePlus className={formStyles.attachmentIcon} strokeWidth={2.5} />
        }
            </button>
          <button className={formStyles.sendButton}>Send</button>
        </form>
      </div>
      {fileToggle && (
        <FileForm file={file} setFile={setFile} fileToggle={fileToggle} setFileToggle={setFileToggle} handleUploadFile={handleUploadFile}
        preview={preview} setPreview={setPreview} />
      )}
    </div>
  )
}

export default SendMessage;