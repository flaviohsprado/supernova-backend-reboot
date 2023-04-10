import { HttpStatus } from '@nestjs/common/enums';
import { ICacheManager } from '../../../../src/interfaces/abstracts/cache.interface';
import { IExceptionService } from '../../../../src/interfaces/abstracts/exceptions.interface';
import { IUserRepository } from '../../../../src/interfaces/repositories/user.repository';
import { FindUserByKeyUseCase } from '../../../../src/modules/user/use-cases';

describe('FindUserByKeyUseCase', () => {
  let repository: IUserRepository;
  let exceptionService: IExceptionService;
  let cacheManager: ICacheManager;
  let findUserByKeyUseCase: FindUserByKeyUseCase;

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
      findByKey: jest.fn().mockResolvedValue(userMock),
    }));

    repository = new UserRepositoryMock();

    findUserByKeyUseCase = new FindUserByKeyUseCase(
      repository,
      exceptionService,
      cacheManager,
    );

    const user = await findUserByKeyUseCase.execute('id', '1');

    expect(user).toEqual(userMock);
  });

  it('should throw an exception if user is not found', async () => {
    const UserRepositoryMockUndefined = jest.fn<IUserRepository, []>(() => ({
      findByKey: jest.fn().mockReturnValue(undefined),
    }));

    const ExceptionServiceMock = jest.fn<IExceptionService, []>(() => ({
      throwNotFoundException: jest.fn().mockReturnValue({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      }),
    }));

    repository = new UserRepositoryMockUndefined();
    exceptionService = new ExceptionServiceMock();

    findUserByKeyUseCase = new FindUserByKeyUseCase(
      repository,
      exceptionService,
      cacheManager,
    );

    expect(await findUserByKeyUseCase.execute('id', '1')).toEqual(undefined);
  });
});
