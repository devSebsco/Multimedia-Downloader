export type ContentType = 'video' | 'audio';

export type VideoFormat = {
  id: string;
  quality: string;
  ext: string;
  filesize: number | null;
};

export type AudioFormat = {
  id: string;
  quality: string;
  ext: string;
  filesize: number | null;
};

export type MediaInfo = {
  title: string;
  thumbnail: string | null;
  duration: number | null;
  platform: string;
  contentType: ContentType;
  formats: {
    video: VideoFormat[];
    audio: AudioFormat[];
  };
};

export type DownloadRequest = {
  url: string;
  type: 'video' | 'audio';
  format: 'mp4' | 'webm' | 'mp3' | 'wav';
  quality: string;
  formatId: string;
};

export type DownloadTarget = {
  type: 'video' | 'audio';
  formats: VideoFormat[] | AudioFormat[];
  duration?: number | null;
  title?: string;
  platform?: string;
};
