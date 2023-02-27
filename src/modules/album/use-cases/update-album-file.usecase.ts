import { ILogger } from 'src/interfaces/abstracts/logger.interface';
import { IUploadService } from 'src/interfaces/abstracts/upload.interface';
import { IAlbumRepository } from 'src/interfaces/repositories/album.repository';
import { IFileRepository } from 'src/interfaces/repositories/file.repository';
import { CreateFileDTO } from 'src/modules/file/dto/file.dto';
import { OwnerType } from '../../../enums/ownerType.enum';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { Album } from '../entities/album.entity';

export class UpdateAlbumFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IAlbumRepository,
    private readonly fileRepository: IFileRepository,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
  ) {}

  public async execute(id: string, file?: CreateFileDTO): Promise<Album> {
    let fileUploaded: CreateFileDTO = file;

    const album = await this.repository.findOne(id);

    const albumFile = await this.fileRepository.findOne(id, OwnerType.ALBUM);

    if (this.environmentConfig.getCloudUpload()) {
      if (albumFile) await this.uploadService.deleteFile([albumFile.key]);

      fileUploaded = await this.uploadService.uploadFile(file);
    }

    if (albumFile) await this.fileRepository.delete(id, OwnerType.ALBUM);

    album.file = await this.fileRepository.update(
      fileUploaded,
      id,
      OwnerType.ALBUM,
    );

    const updatedAlbum = await this.repository.update(id, album);

    this.logger.log(
      'UpdateAlbumFileUseCases execute()',
      `File ${fileUploaded.originalname} have been updated`,
    );

    return updatedAlbum;
  }
}
