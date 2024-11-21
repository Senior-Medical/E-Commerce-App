import { memoryStorage } from 'multer';
import { NotAcceptableException } from '@nestjs/common';
import { Request } from 'express';

export const multerOptions = (fileSize: number = 5 * 1024 * 1024) => {
  const storage = memoryStorage();

  const limits = {
    fileSize
  }

  const fileFilter = (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!file.mimetype.startsWith('image')) callback(new NotAcceptableException("Only image files are allowed."), false);
    else callback(null, true);
  };

  return {
    storage,
    limits,
    fileFilter
  }
}