import { HttpStatus } from '@nestjs/common';
import { OwnerType } from '../../../enums/ownerType.enum';
import { IBcryptService } from '../../../interfaces/abstracts/bcrypt.interface';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { IJwtService } from '../../../interfaces/abstracts/jwt.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { IUserRepository } from '../../../interfaces/repositories/user.repository';
import { CreateFileDTO } from '../../file/dto/file.dto';
import { CreateUserDTO } from '../dto/user.dto';
import { UserPresenter } from '../dto/user.presenter';

export class CreateUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly fileRepository: IFileRepository,
    private readonly bcryptService: IBcryptService,
    private readonly jwtService: IJwtService,
    private readonly exceptionService: IExceptionService,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
  ) {}

  public async execute(
    user: CreateUserDTO,
    file?: CreateFileDTO,
  ): Promise<UserPresenter> {
    if (await this.repository.alreadyExists('email', user.email)) {
      this.exceptionService.throwForbiddenException({
        message: 'Email already exists in app!',
        statusCode: HttpStatus.FORBIDDEN,
      });

      return;
    }

    const createdUser = await this.createUser(user);

    if (file) createdUser.file = await this.createFile(user.id, file);

    this.logger.log(
      'CreateUserUseCases execute()',
      'New user have been inserted',
    );

    return createdUser;
  }

  private async createUser(user: CreateUserDTO): Promise<UserPresenter> {
    user.password = await this.bcryptService.createHash(user.password);

    const userCreated = await this.repository.create(user);

    const token: string = await this.jwtService.createToken({
      id: userCreated.id,
    });

    return new UserPresenter({
      ...userCreated,
      accessToken: token,
    });
  }

  private async createFile(
    id: string,
    file: CreateFileDTO,
  ): Promise<CreateFileDTO> {
    if (this.environmentConfig.getCloudUpload()) {
      file = await this.uploadService.uploadFile(file);
    }

    await this.fileRepository.create(file, id, OwnerType.USER);

    return file;
  }
}
