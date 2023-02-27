import { OwnerType } from '../../../enums/ownerType.enum';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { IPlaylistRepository } from '../../../interfaces/repositories/playlist.repository';
import { CreateFileDTO } from '../../../modules/file/dto/file.dto';
import { Playlist } from '../entities/playlist.entity';

export class UpdatePlaylistFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IPlaylistRepository,
    private readonly fileRepository: IFileRepository,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
  ) {}

  public async execute(id: string, file?: CreateFileDTO): Promise<Playlist> {
    let fileUploaded: CreateFileDTO = file;

    const playlist = await this.repository.findOne(id);

    const playlistFile = await this.fileRepository.findOne(
      id,
      OwnerType.PLAYLIST,
    );

    if (this.environmentConfig.getCloudUpload()) {
      if (playlistFile) await this.uploadService.deleteFile([playlistFile.key]);

      fileUploaded = await this.uploadService.uploadFile(file);
    }

    if (playlistFile) await this.fileRepository.delete(id, OwnerType.PLAYLIST);

    playlist.file = await this.fileRepository.update(
      fileUploaded,
      id,
      OwnerType.PLAYLIST,
    );

    const updatedPlaylist = await this.repository.update(id, playlist);

    this.logger.log(
      'UpdatePlaylistFileUseCases execute()',
      `File ${fileUploaded.originalname} have been updated`,
    );

    return updatedPlaylist;
  }
}
