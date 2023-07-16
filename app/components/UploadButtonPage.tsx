import { useRef } from 'react';
import styles from '../styles/uploadButtonPage.module.css';

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UploadButtonPage = ({ handleChange }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = () => {
    inputRef.current?.click();
  };

  return (
    <div className={styles.mainDiv}>
      <h1 className={styles.title}>Video Cutter</h1>
      <h3 className={styles.description}>Trim or cut video of any format</h3>
      <button onClick={handleFileUpload} className={styles.selectButton}>
        {'Click to select'}
      </button>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default UploadButtonPage;
