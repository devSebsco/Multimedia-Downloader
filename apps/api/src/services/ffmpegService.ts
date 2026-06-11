import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { logger } from '../utils/logger';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export function extractAudio(
  inputPath: string,
  format: 'mp3' | 'wav',
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath).noVideo();

    if (format === 'mp3') {
      command = command.audioCodec('libmp3lame').audioBitrate(320);
    } else {
      command = command.audioCodec('pcm_s16le').audioFrequency(44100);
    }

    command
      .output(outputPath)
      .on('end', () => {
        logger.debug(`FFmpeg conversion complete: ${outputPath}`);
        resolve();
      })
      .on('error', (err: Error) => {
        logger.error(`FFmpeg error: ${err.message}`);
        reject(Object.assign(new Error(`Error al convertir audio: ${err.message}`), { code: 'CONVERSION_FAILED' }));
      })
      .run();
  });
}
