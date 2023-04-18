import { OwnerType } from '../../enums/ownerType.enum';
import { CreateFileDTO } from '../../modules/file/dto/file.dto';
import { File } from '../../modules/file/entities/file.entity';

export interface IFileRepository {
  findOne?(ownerId: string, ownerType: OwnerType): Promise<File>;
  findByKey?(key: string, value: string): Promise<File>;
  create?(
    files: CreateFileDTO,
    ownerId: string,
    ownerType: OwnerType,
  ): Promise<File>;
  update?(
    files: CreateFileDTO,
    ownerId: string,
    ownerType: OwnerType,
  ): Promise<File>;
  delete?(ownerId: string, ownerType: OwnerType): Promise<File>;
}
