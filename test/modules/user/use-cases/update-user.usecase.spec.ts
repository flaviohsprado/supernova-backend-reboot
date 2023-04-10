import { IBcryptService } from '../../../../src/interfaces/abstracts/bcrypt.interface';
import { IExceptionService } from '../../../../src/interfaces/abstracts/exceptions.interface';
import { ILogger } from '../../../../src/interfaces/abstracts/logger.interface';
import { IUserRepository } from '../../../../src/interfaces/repositories/user.repository';
import { UpdateUserUseCase } from '../../../../src/modules/user/use-cases';

describe.only('UpdateUserUseCase', () => {
  let logger: ILogger;
  let repository: IUserRepository;
  let bcryptService: IBcryptService;
  let exceptionService: IExceptionService;
  let updateUserUseCase: UpdateUserUseCase;

  const createdAt = new Date('2023-01-01T14:00:00Z');
  const updatedAt = new Date('2023-01-02T14:00:00Z');
  const mockedToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjFkM2M4MjMwLTQ2NjQtNDhkYS1hMDc2LTE2M2I0YzI2OGQ3ZSIsImF2YXRhciI6Im51bGwiLCJ1c2VybmFtZSI6ImV4YW1wbGUifQ.AXfdNVQhrfqPgtBBJ6rEOVAzQILOk5QfsYkXgRtYFjc';

  beforeEach(() => {
    const LoggerMock = jest.fn<ILogger, []>(() => ({
      log: jest.fn(),
    }));

    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      update: jest.fn().mockResolvedValue({
        id: '1d3c8230-4664-48da-a076-163b4c268d7e',
        email: 'example@example.com',
        username: 'example',
        createdAt,
        updatedAt,
      }),
      alreadyExists: jest.fn().mockResolvedValue(false),
    }));

    const BcryptServiceMock = jest.fn<IBcryptService, []>(() => ({
      createHash: jest.fn(),
    }));

    const ExceptionServiceMock = jest.fn<IExceptionService, []>(() => ({
      throwForbiddenException: jest.fn(),
    }));

    logger = new LoggerMock();
    repository = new UserRepositoryMock();
    bcryptService = new BcryptServiceMock();
    exceptionService = new ExceptionServiceMock();

    updateUserUseCase = new UpdateUserUseCase(
      logger,
      repository,
      bcryptService,
      exceptionService,
    );
  });

  it('should be defined', () => {
    expect(updateUserUseCase).toBeDefined();
  });

  it('should be able to update a user without a file, on success', async () => {
    const updateUser = await updateUserUseCase.execute(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
      {
        email: 'example@example.com',
        username: 'example',
        password: '123456',
      },
    );

    expect(updateUser).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      email: 'example@example.com',
      username: 'example',
      file: undefined,
      role: undefined,
      createdAt: '01/01/2023 11:00:00',
      updatedAt: '02/01/2023 11:00:00',
    });
  });

  it('should be not able to update a user, because the email changed already exists', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      alreadyExists: jest.fn().mockResolvedValue(true),
    }));

    repository = new UserRepositoryMock();

    updateUserUseCase = new UpdateUserUseCase(
      logger,
      repository,
      bcryptService,
      exceptionService,
    );

    const updateUser = await updateUserUseCase.execute(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
      {
        email: 'example@example.com',
        username: 'example',
        password: '123456',
      },
    );

    expect(updateUser).toEqual(undefined);
  });
});
