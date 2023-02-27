import { OwnerType } from '../../../enums/ownerType.enum';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IAlbumRepository } from '../../../interfaces/repositories/album.repository';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { CreateFileDTO } from '../../../modules/file/dto/file.dto';
import { CreateAlbumDTO } from '../dto/album.dto';
import { AlbumPresenter } from '../dto/album.presenter';

export class CreateAlbumUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IAlbumRepository,
    private readonly fileRepository: IFileRepository,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
  ) {}

  public async execute(
    album: CreateAlbumDTO,
    file?: CreateFileDTO,
  ): Promise<AlbumPresenter> {
    if (file) album.file = await this.createFile(album.id, file);

    const createdAlbum: AlbumPresenter = new AlbumPresenter(
      await this.repository.create(album),
    );

    this.logger.log(
      'CreateAlbumUseCases execute()',
      'New album have been inserted',
    );

    return createdAlbum;
  }

  private async createFile(
    id: string,
    file: CreateFileDTO,
  ): Promise<CreateFileDTO> {
    let fileUploaded: CreateFileDTO = file;

    if (this.environmentConfig.getCloudUpload()) {
      fileUploaded = await this.uploadService.uploadFile(file);
    }

    return await this.fileRepository.create(fileUploaded, id, OwnerType.ALBUM);
  }
}
