import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class FileService {
  async createFile(file: MemoryStoredFile): Promise<string> {
    if (!file) return null;
    
    try {
      const filePath = path.resolve(__dirname, '..', '..', '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      let fileName = generateFileName();

      fs.writeFileSync(path.join(filePath, fileName), file.buffer);

      return fileName;
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFile(fileName: string) {
    if (!fileName) return

    try {
      const filePath = path.resolve(__dirname, '..', '..', '..', 'static', fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

const generateFileName = () => uuid.v4() + '.jpg';
