import { CreateFileDTO } from '../../modules/file/dto/file.dto';

export class FileUtils {
  static async createFile(file: Express.Multer.File): Promise<CreateFileDTO> {
    if (file) {
      const { filename, mimetype, encoding, buffer } = await file;

      const key = `${Date.now()}-${filename}`;

      const newFile: CreateFileDTO = new CreateFileDTO({
        originalname: filename,
        fieldname: 'file',
        mimetype,
        encoding,
        buffer,
        key,
      });

      return newFile;
    }
  }

  static async createBase64FromBuffer(
    file: Express.Multer.File,
  ): Promise<string> {
    const { buffer } = file;

    return buffer.toString('base64');
  }
}
