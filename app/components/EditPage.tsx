import * as helpers from '../../utils/helpers';
import { useRef, useState } from 'react';
import styles from '../styles/editPage.module.css';

type Props = {
  handleLoadedData: any;
  videoSrc: string;
  inputVideoFile: File;
  thumbnails: any;
  thumbnailIsProcessing: boolean;
  duration: number | undefined;
  rStart: number;
  rEnd: number;
  handleUpdateRangeStart: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateRangeEnd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTrim: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const EditPage = ({
  handleLoadedData,
  videoSrc,
  inputVideoFile,
  thumbnails,
  thumbnailIsProcessing,
  duration,
  rStart,
  rEnd,
  handleUpdateRangeStart,
  handleUpdateRangeEnd,
  handleTrim,
}: Props) => {
  const RANGE_MAX = 100;

  return (
    <div className={styles.editPage}>
      <h2 className={styles.videoTitle}>{inputVideoFile!.name}</h2>
      <div className={styles.videoDiv}>
        <video
          src={videoSrc}
          onLoadedMetadata={handleLoadedData}
          autoPlay
          controls
          muted
          width="450"
        />
      </div>

      <div className={styles.range_pack}>
        <div className={styles.image_box}>
          {thumbnails.map((imgURL: any, id: number) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgURL} alt={`sample_video_thumbnail_${id}`} key={id} />
          ))}

          <div
            className={styles.clip_box}
            style={{
              width: `calc(${rEnd - rStart}% )`,
              left: `${rStart}%`,
            }}
            data-start={helpers.toTimeString(
              (rStart / RANGE_MAX) * duration!,
              false
            )}
            data-end={helpers.toTimeString(
              (rEnd / RANGE_MAX) * duration!,
              false
            )}
          >
            <span className={styles.clip_box_des}></span>
            <span className={styles.clip_box_des}></span>
          </div>

          <input
            className={styles.range}
            type="range"
            min={0}
            max={RANGE_MAX}
            onChange={handleUpdateRangeStart}
            value={rStart}
          />
          <input
            className={styles.range}
            type="range"
            min={0}
            max={RANGE_MAX}
            onChange={handleUpdateRangeEnd}
            value={rEnd}
          />
        </div>
      </div>

      <button onClick={handleTrim} className={styles.trimButton}>
        {'Trim'}
      </button>
    </div>
  );
};

export default EditPage;
