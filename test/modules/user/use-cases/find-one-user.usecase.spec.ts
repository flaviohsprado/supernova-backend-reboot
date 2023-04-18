import { HttpStatus } from '@nestjs/common/enums';
import { ICacheManager } from '../../../../src/interfaces/abstracts/cache.interface';
import { IExceptionService } from '../../../../src/interfaces/abstracts/exceptions.interface';
import { IUserRepository } from '../../../../src/interfaces/repositories/user.repository';
import { FindOneUserUseCase } from '../../../../src/modules/user/use-cases';

describe('FindOneUserUseCase', () => {
  let repository: IUserRepository;
  let exceptionService: IExceptionService;
  let cacheManager: ICacheManager;
  let findOneUserUseCase: FindOneUserUseCase;

  beforeEach(() => {
    const ExceptionServiceMock = jest.fn<IExceptionService, []>(() => ({
      throwForbiddenException: jest.fn(),
    }));

    const CacheManagerMock = jest.fn<ICacheManager, []>(() => ({
      getCachedObject: jest.fn(),
      setObjectInCache: jest.fn(),
    }));

    exceptionService = new ExceptionServiceMock();
    cacheManager = new CacheManagerMock();
  });

  it('should return an user', async () => {
    const UserRepositoryMock = jest.fn<IUserRepository, []>(() => ({
      findOne: jest.fn().mockResolvedValue({
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

    findOneUserUseCase = new FindOneUserUseCase(
      repository,
      exceptionService,
      cacheManager,
    );

    const user = await findOneUserUseCase.execute('1');

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

  it('should throw an exception if user is not found', async () => {
    const UserRepositoryMockUndefined = jest.fn<IUserRepository, []>(() => ({
      findOne: jest.fn().mockReturnValue(undefined),
    }));

    const ExceptionServiceMock = jest.fn<IExceptionService, []>(() => ({
      throwNotFoundException: jest.fn().mockReturnValue({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      }),
    }));

    repository = new UserRepositoryMockUndefined();
    exceptionService = new ExceptionServiceMock();

    findOneUserUseCase = new FindOneUserUseCase(
      repository,
      exceptionService,
      cacheManager,
    );

    expect(await findOneUserUseCase.execute('1')).toEqual(undefined);
  });
});
