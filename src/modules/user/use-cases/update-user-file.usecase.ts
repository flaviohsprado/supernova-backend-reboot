import { EnvironmentConfigService } from '../../../common/core/environment-config/environment-config.service';
import { OwnerType } from '../../../enums/ownerType.enum';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { IUserRepository } from '../../../interfaces/repositories/user.repository';
import { CreateFileDTO } from '../../../modules/file/dto/file.dto';
import { User } from '../entities/user.entity';

export class UpdateUserFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly fileRepository: IFileRepository,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: EnvironmentConfigService,
  ) {}

  public async execute(id: string, file?: CreateFileDTO): Promise<User> {
    let fileUploaded: CreateFileDTO = file;

    const user = await this.repository.findOne(id);

    const userFile = await this.fileRepository.findOne(id, OwnerType.USER);

    if (this.environmentConfig.getCloudUpload()) {
      await this.uploadService.deleteFile([userFile.key]);
      fileUploaded = await this.uploadService.uploadFile(file);
    }

    await this.fileRepository.delete(id, OwnerType.USER);

    user.file = await this.fileRepository.update(
      fileUploaded,
      id,
      OwnerType.USER,
    );

    const updatedUser = await this.repository.update(id, user);

    this.logger.log(
      'UpdateUserFileUseCases execute()',
      `File ${fileUploaded.originalname} have been updated`,
    );

    return updatedUser;
  }
}
