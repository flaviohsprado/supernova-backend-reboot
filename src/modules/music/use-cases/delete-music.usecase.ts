import { HttpStatus } from '@nestjs/common';
import { OwnerType } from '../../../enums/ownerType.enum';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { IMusicRepository } from '../../../interfaces/repositories/music.repository';
import { File } from '../../../modules/file/entities/file.entity';
import { Music } from '../entities/music.entity';

export class DeleteMusicUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IMusicRepository,
    private readonly exceptionService: IExceptionService,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
    private readonly fileRepository: IFileRepository,
  ) {}

  public async execute(id: string): Promise<Music> {
    const musicDeleted = await this.repository.delete(id);
    await this.deleteFile(id);

    if (musicDeleted) {
      this.logger.log(
        'DeleteMusicUseCases execute()',
        `Music ${id} have been deleted`,
      );

      return musicDeleted;
    } else {
      this.exceptionService.throwNotFoundException({
        message: 'Music not found!',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  private async deleteFile(id: string): Promise<File> {
    const file = await this.fileRepository.findOne(id, OwnerType.USER);

    if (!file) return;

    if (this.environmentConfig.getCloudUpload()) {
      await this.uploadService.deleteFile([file.key]);
    }

    return await this.fileRepository.delete(id, OwnerType.USER);
  }
}
