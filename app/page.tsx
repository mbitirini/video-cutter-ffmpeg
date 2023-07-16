'use client';

import styles from './styles/page.module.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import UploadButtonPage from './components/UploadButtonPage';
import EditPage from './components/EditPage';
import { useState } from 'react';
import * as helpers from '../utils/helpers';
import ResultPage from './components/ResultPage';

const FF = createFFmpeg({
  log: true,
});

(async function () {
  await FF.load();
})();

export default function Home() {
  interface Meta {
    name: string;
    duration: number;
    videoWidth: number;
    videoHeight: number;
  }

  const [inputVideoFile, setInputVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [videoMeta, setVideoMeta] = useState<Meta | null>(null);
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [thumbnailIsProcessing, setThumbnailIsProcessing] = useState(false);
  const [rStart, setRstart] = useState<number>(0);
  const [rEnd, setRend] = useState<number>(10);
  const [trimmedVideoFile, setTrimmedVideoFile] = useState('');

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setInputVideoFile(file);
    const src = file
      ? URL.createObjectURL(new Blob([file], { type: 'video/mp4' }))
      : null;
    setVideoSrc(src!);
  };

  const handleLoadedData = async (e: any) => {
    const el = e.target;

    const meta = {
      name: inputVideoFile!.name,
      duration: el!.duration,
      videoWidth: el!.videoWidth,
      videoHeight: el!.videoHeight,
    };
    setVideoMeta(meta);
    const thumbnails = await getThumbnails(meta.duration);
    setThumbnails(thumbnails);
  };

  const getThumbnails = async (duration: number) => {
    if (!FF.isLoaded()) {
      await FF.load();
    }
    setThumbnailIsProcessing(true);
    const MAX_NUMBER_OF_IMAGES = 15;
    const NUMBER_OF_IMAGES = duration < MAX_NUMBER_OF_IMAGES ? duration : 15;
    const offset =
      duration === MAX_NUMBER_OF_IMAGES ? 1 : duration / NUMBER_OF_IMAGES;

    const arrayOfImageURIs = [];
    FF.FS('writeFile', inputVideoFile!.name, await fetchFile(inputVideoFile!));

    for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
      const startTimeInSecs = helpers.toTimeString(Math.round(i * offset));

      try {
        await FF.run(
          '-ss',
          startTimeInSecs,
          '-i',
          inputVideoFile!.name,
          '-t',
          '00:00:1.000',
          '-vf',
          `scale=150:-1`,
          `img${i}.png`
        );
        const data = FF.FS('readFile', `img${i}.png`);

        const blob = new Blob([data.buffer], { type: 'image/png' });
        const dataURI = await helpers.readFileAsBase64(blob);
        FF.FS('unlink', `img${i}.png`);
        arrayOfImageURIs.push(dataURI);
      } catch (error) {
        console.log({ message: error });
      }
    }
    setThumbnailIsProcessing(false);

    return arrayOfImageURIs;
  };

  const handleTrim = async () => {
    const startTime = Number(
      ((rStart! / 100) * videoMeta!.duration).toFixed(2)
    );
    const offset = Number(
      ((rEnd! / 100) * videoMeta!.duration - startTime).toFixed(2)
    );
    console.log(
      startTime,
      offset,
      helpers.toTimeString(startTime),
      helpers.toTimeString(offset)
    );

    try {
      FF.FS(
        'writeFile',
        inputVideoFile!.name,
        await fetchFile(inputVideoFile!)
      );

      await FF.run(
        '-ss',
        helpers.toTimeString(startTime),
        '-i',
        inputVideoFile!.name,
        '-t',
        helpers.toTimeString(offset),
        '-c',
        'copy',
        'ping.mp4'
      );

      const data = FF.FS('readFile', 'ping.mp4');
      const dataURL = await helpers.readFileAsBase64(
        new Blob([data.buffer], { type: 'video/mp4' })
      );
      setTrimmedVideoFile(dataURL);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateRangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRstart(parseInt(e.target.value));
  };

  const handleUpdateRangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRend(parseInt(e.target.value));
  };

  return (
    <main className={styles.main}>
      {videoSrc === '' && <UploadButtonPage handleChange={handleChange} />}
      {videoSrc !== '' && trimmedVideoFile === '' && (
        <EditPage
          handleLoadedData={handleLoadedData}
          videoSrc={videoSrc}
          inputVideoFile={inputVideoFile!}
          thumbnails={thumbnails}
          thumbnailIsProcessing={thumbnailIsProcessing}
          duration={videoMeta?.duration}
          rStart={rStart}
          rEnd={rEnd}
          handleUpdateRangeStart={handleUpdateRangeStart}
          handleUpdateRangeEnd={handleUpdateRangeEnd}
          handleTrim={handleTrim}
        />
      )}
      {trimmedVideoFile !== '' && (
        <ResultPage
          trimmedSrc={trimmedVideoFile}
          handleDownload={() => helpers.download(trimmedVideoFile)}
          handleGetBack={() => setTrimmedVideoFile('')}
        />
      )}
    </main>
  );
}
