import { OwnerType } from '../../../enums/ownerType.enum';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { IUserRepository } from '../../../interfaces/repositories/user.repository';
import { CreateFileDTO } from '../../../modules/file/dto/file.dto';
import { UserPresenter } from '../dto/user.presenter';

export class UpdateUserFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly fileRepository: IFileRepository,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
  ) {}

  public async execute(
    id: string,
    file?: CreateFileDTO,
  ): Promise<UserPresenter> {
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

    const userPresenter: UserPresenter = new UserPresenter(updatedUser);

    return userPresenter;
  }
}
