import { registerAs } from '@nestjs/config';
import { APP_DOMAIN_LOCAL, APP_DOMAIN_PRODUCTION } from 'src/_common/constants/uri.constant';

export interface UploadConfig {
  uploadPath: string;
  mediaBaseUrl: string;
  mediaFolderDomain: string;
  maxFileSize: number; // bytes
  allowedMimeTypes: string[];
}

export default registerAs('upload', (): UploadConfig => {
  return {
    uploadPath: process.env.NODE_ENV === 'production' ? '/app/public/media' : './local-uploads',
    mediaBaseUrl: process.env.MEDIA_BASE_URL || `http://${APP_DOMAIN_LOCAL}`,
    mediaFolderDomain: process.env.NODE_ENV === 'production' ? APP_DOMAIN_PRODUCTION : 'public/media',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ],
  };
});