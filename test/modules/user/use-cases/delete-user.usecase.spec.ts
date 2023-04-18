import { HttpStatus } from '@nestjs/common/enums';
import { IEnvironmentConfigService } from '../../../../src/interfaces/abstracts/environmentConfigService.interface';
import { IExceptionService } from '../../../../src/interfaces/abstracts/exceptions.interface';
import { ILogger } from '../../../../src/interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../../src/interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../../src/interfaces/repositories/file.repository';
import { IUserRepository } from '../../../../src/interfaces/repositories/user.repository';
import { DeleteUserUseCase } from '../../../../src/modules/user/use-cases';

describe('DeleteUserUseCase', () => {
  let logger: ILogger;
  let repository: IUserRepository;
  let exceptionService: IExceptionService;
  let uploadService: IUploadService;
  let environmentConfig: IEnvironmentConfigService;
  let fileRepository: IFileRepository;
  let deleteUserUseCase: DeleteUserUseCase;

  const userMock = {
    id: '1',
    email: 'example@example.com',
    username: 'example',
    accessToken: undefined,
    file: undefined,
    role: undefined,
    createdAt: '01/01/2023 11:00:00',
    updatedAt: '01/01/2023 11:00:00',
  };

  const fileMock = {
    id: '8c128299-4c9f-47bd-898e-60afa4105c1b',
    ownerId: '1',
    ownerType: 'user',
    originalname: 'test.png',
    buffer: Buffer.from('test'),
  };

  beforeEach(() => {
    const LoggerMock = jest.fn<ILogger, []>(() => ({
      log: jest.fn(),
    }));

    const ExceptionServiceMock = jest.fn<IExceptionService, []>(() => ({
      throwNotFoundException: jest.fn().mockReturnValue({
        message: 'User not found!',
        statusCode: HttpStatus.NOT_FOUND,
      }),
    }));

    const UploadServiceMock = jest.fn<IUploadService, []>(() => ({
      deleteFile: jest.fn(),
    }));

    const EnvironmentConfigServiceMock = jest.fn<IEnvironmentConfigService, []>(
      () => ({
        getCloudUpload: jest.fn().mockReturnValue(false),
      }),
    );

    const FileRepositoryMock = jest.fn<IFileRepository, []>(() => ({
      findOne: jest.fn().mockResolvedValue(undefined),
    }));

    logger = new LoggerMock();
    exceptionService = new ExceptionServiceMock();
    uploadService = new UploadServiceMock();
    environmentConfig = new EnvironmentConfigServiceMock();
    fileRepository = new FileRepositoryMock();
  });

  it('should return an user', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      delete: jest.fn().mockResolvedValue({
        id: '1',
        email: 'example@example.com',
        username: 'example',
        accessToken: undefined,
        file: undefined,
        role: undefined,
        createdAt: '01/01/2023 11:00:00',
        updatedAt: '01/01/2023 11:00:00',
      }),
    }));

    repository = new UserRepositoryMock();

    deleteUserUseCase = new DeleteUserUseCase(
      logger,
      repository,
      exceptionService,
      uploadService,
      environmentConfig,
      fileRepository,
    );

    const user = await deleteUserUseCase.execute('1');

    expect(user).toEqual({
      id: '1',
      email: 'example@example.com',
      username: 'example',
      accessToken: undefined,
      file: undefined,
      role: undefined,
      createdAt: '01/01/2023 11:00:00',
      updatedAt: '01/01/2023 11:00:00',
    });
  });

  it('should return an user and delete file in local upload', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      delete: jest.fn().mockResolvedValue(userMock),
    }));

    const FileRepositoryMock = jest.fn<IFileRepository, []>(() => ({
      findOne: jest.fn().mockResolvedValue(fileMock),
      delete: jest.fn().mockResolvedValue(fileMock),
    }));

    const EnvironmentConfigServiceMock = jest.fn<IEnvironmentConfigService, []>(
      () => ({
        getCloudUpload: jest.fn().mockReturnValue(false),
      }),
    );

    repository = new UserRepositoryMock();
    fileRepository = new FileRepositoryMock();
    environmentConfig = new EnvironmentConfigServiceMock();

    deleteUserUseCase = new DeleteUserUseCase(
      logger,
      repository,
      exceptionService,
      uploadService,
      environmentConfig,
      fileRepository,
    );

    const user = await deleteUserUseCase.execute('1');

    expect(user).toEqual({
      id: '1',
      email: 'example@example.com',
      username: 'example',
      accessToken: undefined,
      file: undefined,
      role: undefined,
      createdAt: '01/01/2023 11:00:00',
      updatedAt: '01/01/2023 11:00:00',
    });
  });

  it('should return an user and delete file in cloud upload', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      delete: jest.fn().mockResolvedValue(userMock),
    }));

    const FileRepositoryMock = jest.fn<IFileRepository, []>(() => ({
      findOne: jest.fn().mockResolvedValue(fileMock),
      delete: jest.fn().mockResolvedValue(fileMock),
    }));

    const EnvironmentConfigServiceMock = jest.fn<IEnvironmentConfigService, []>(
      () => ({
        getCloudUpload: jest.fn().mockReturnValue(true),
      }),
    );

    repository = new UserRepositoryMock();
    fileRepository = new FileRepositoryMock();
    environmentConfig = new EnvironmentConfigServiceMock();

    deleteUserUseCase = new DeleteUserUseCase(
      logger,
      repository,
      exceptionService,
      uploadService,
      environmentConfig,
      fileRepository,
    );

    const user = await deleteUserUseCase.execute('1');

    expect(user).toEqual(userMock);
  });

  it('should return undefined if user is not found', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      delete: jest.fn().mockResolvedValue(undefined),
    }));

    repository = new UserRepositoryMock();

    deleteUserUseCase = new DeleteUserUseCase(
      logger,
      repository,
      exceptionService,
      uploadService,
      environmentConfig,
      fileRepository,
    );

    expect(await deleteUserUseCase.execute('1')).toEqual(undefined);
  });
});
