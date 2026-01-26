import { registerAs } from '@nestjs/config';

export interface UploadConfig {
  path: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
  mediaBaseUrl: string;
}

export default registerAs(
  'upload',
  (): UploadConfig => ({
    path: process.env.UPLOAD_PATH || './local-uploads',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ],
    mediaBaseUrl: process.env.MEDIA_BASE_URL || '/public/media',
  })
);
