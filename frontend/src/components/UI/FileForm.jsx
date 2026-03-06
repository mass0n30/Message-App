import { useState } from 'react';
import styles from '../../styles/components/form.module.css';
import { XCircle } from 'lucide-react';

export default function FileForm({ file, setFile, fileToggle, setFileToggle, handleUploadFile, preview, setPreview, handleUploadAvatar }) {


  const handleClose = () => {
    setFileToggle(false);
    setFile(null);
  }

  const handleAttachFile = (e) => {
    if (handleUploadAvatar) {
      handleUploadFile(e);
    }
    e.preventDefault();
    setFileToggle(false);
  }

  return (
    <div className={styles.addFileModal}> 
      <div className={styles.formContainer}>
        <div className={styles.fileToggleBtns}>
          {fileToggle && <div><button className={styles.closeModalButton} onClick={handleClose}><XCircle className={styles.closeIcon} /></button></div>}
        </div>
        {fileToggle && (
        <div className={styles.addFileModalContent}>
          <label>Add a File</label>

          <form onSubmit={handleAttachFile} method="POST" className={styles.fileForm} autoComplete="off">
            <input type="file" name="avatar" className={styles.fileInput} onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }} />
            {preview && <img src={preview} className={styles.previewImage} alt="preview" />}
            <button type="submit">Upload</button>
          </form>

        </div>
        
        )}
      </div>
    </div>
  );

}