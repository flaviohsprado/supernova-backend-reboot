import { OwnerType } from '../../../enums/ownerType.enum';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { IPlaylistRepository } from '../../../interfaces/repositories/playlist.repository';
import { CreateFileDTO } from '../../../modules/file/dto/file.dto';
import { CreatePlaylistDTO } from '../dto/playlist.dto';
import { PlaylistPresenter } from '../dto/playlist.presenter';

export class CreatePlaylistUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IPlaylistRepository,
    private readonly fileRepository: IFileRepository,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
  ) {}

  public async execute(
    playlist: CreatePlaylistDTO,
    file?: CreateFileDTO,
  ): Promise<PlaylistPresenter> {
    if (file) playlist.file = await this.createFile(playlist.id, file);

    const createdPlaylist: PlaylistPresenter = new PlaylistPresenter(
      await this.repository.create(playlist),
    );

    this.logger.log(
      'CreatePlaylistUseCases execute()',
      'New playlist have been inserted',
    );

    return createdPlaylist;
  }

  private async createFile(
    id: string,
    file: CreateFileDTO,
  ): Promise<CreateFileDTO> {
    let fileUploaded: CreateFileDTO = file;

    if (this.environmentConfig.getCloudUpload()) {
      fileUploaded = await this.uploadService.uploadFile(file);
    }

    return await this.fileRepository.create(
      fileUploaded,
      id,
      OwnerType.PLAYLIST,
    );
  }
}
