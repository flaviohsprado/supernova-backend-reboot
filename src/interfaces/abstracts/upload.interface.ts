import { CreateFileDTO } from '../../modules/file/dto/file.dto';

export interface IUploadService {
  uploadFile?(file: CreateFileDTO): Promise<CreateFileDTO>;
  deleteFile?(keys: string[]): Promise<void>;
}
