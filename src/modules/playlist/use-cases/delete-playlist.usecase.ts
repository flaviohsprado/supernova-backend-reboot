import { HttpStatus } from '@nestjs/common';
import { OwnerType } from '../../../enums/ownerType.enum';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { IPlaylistRepository } from '../../../interfaces/repositories/playlist.repository';
import { File } from '../../../modules/file/entities/file.entity';
import { Playlist } from '../entities/playlist.entity';

export class DeletePlaylistUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IPlaylistRepository,
    private readonly exceptionService: IExceptionService,
    private readonly fileRepository: IFileRepository,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
  ) {}

  public async execute(id: string): Promise<Playlist> {
    const playlistDeleted = await this.repository.delete(id);

    await this.deleteFile(id);

    if (playlistDeleted) {
      this.logger.log(
        'DeletePlaylistUseCases execute()',
        `Playlist ${id} have been deleted`,
      );

      return playlistDeleted;
    } else {
      this.exceptionService.throwNotFoundException({
        message: 'Playlist not found!',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  private async deleteFile(id: string): Promise<File> {
    const file = await this.fileRepository.findOne(id, OwnerType.PLAYLIST);

    if (!file) return;

    if (this.environmentConfig.getCloudUpload()) {
      await this.uploadService.deleteFile([file.key]);
    }

    return await this.fileRepository.delete(id, OwnerType.PLAYLIST);
  }
}
