import styles from '../../styles/components/form.module.css';
import { XCircle } from 'lucide-react';

export default function FileForm({ file, setFile, fileToggle, setFileToggle, handleUploadFile }) {

  const handleClose = () => {
    setFileToggle(false);
    setFile(null);
  }

  return (
    <div> 
      <div className={styles.fileToggleBtns}>
        {fileToggle && <div><button className={styles.closeModalButton} onClick={handleClose}><XCircle className={styles.closeIcon} /></button></div>}
      </div>
      {fileToggle && (
      <div className={styles.addFileModalContent}>
        <label>Add a File</label>
        
        <form onSubmit={handleUploadFile}>
          <input type="file" name="avatar" className={styles.fileInput} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button type="submit">Upload</button>
        </form>

      </div>
      )}
    </div>
  );

}