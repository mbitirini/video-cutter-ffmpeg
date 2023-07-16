import styles from '../styles/resultPage.module.css';

type Props = {
  trimmedSrc: string;
  handleDownload: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleGetBack: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const ResultPage = ({ trimmedSrc, handleDownload, handleGetBack }: Props) => {
  return (
    <div className={styles.resultPage}>
      <div className={styles.videoContainer}>
        <video src={trimmedSrc} autoPlay controls muted width="450" />
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={handleGetBack} className={styles.btn}>
          go back
        </button>
        <button onClick={handleDownload} className={styles.btn}>
          download
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
