import { HttpStatus } from '@nestjs/common';
import { OwnerType } from '../../../enums/ownerType.enum';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IAlbumRepository } from '../../../interfaces/repositories/album.repository';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { File } from '../../../modules/file/entities/file.entity';
import { Album } from '../entities/album.entity';

export class DeleteAlbumUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IAlbumRepository,
    private readonly exceptionService: IExceptionService,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
    private readonly fileRepository: IFileRepository,
  ) {}

  public async execute(id: string): Promise<Album> {
    const albumDeleted = await this.repository.delete(id);
    await this.deleteFile(id);

    if (albumDeleted) {
      this.logger.log(
        'DeleteAlbumUseCases execute()',
        `Album ${id} have been deleted`,
      );

      return albumDeleted;
    } else {
      this.exceptionService.throwNotFoundException({
        message: 'Album not found!',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  private async deleteFile(id: string): Promise<File> {
    const file = await this.fileRepository.findOne(id, OwnerType.ALBUM);

    if (!file) return;

    if (this.environmentConfig.getCloudUpload()) {
      await this.uploadService.deleteFile([file.key]);
    }

    return await this.fileRepository.delete(id, OwnerType.ALBUM);
  }
}
