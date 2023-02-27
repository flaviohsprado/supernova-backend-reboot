import { HttpStatus } from '@nestjs/common';
import { EnvironmentConfigService } from '../../../common/core/environment-config/environment-config.service';
import { OwnerType } from '../../../enums/ownerType.enum';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { IUserRepository } from '../../../interfaces/repositories/user.repository';
import { File } from '../../../modules/file/entities/file.entity';
import { User } from '../entities/user.entity';

export class DeleteUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly exceptionService: IExceptionService,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: EnvironmentConfigService,
    private readonly fileRepository: IFileRepository,
  ) {}

  public async execute(id: string): Promise<User> {
    const userDeleted = await this.repository.delete(id);
    await this.deleteFile(id);

    if (userDeleted) {
      this.logger.log(
        'DeleteUserUseCases execute()',
        `User ${id} have been deleted`,
      );

      return userDeleted;
    } else {
      this.exceptionService.throwNotFoundException({
        message: 'User not found!',
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
