import { ICacheManager } from '../../../../src/interfaces/abstracts/cache.interface';
import { IExceptionService } from '../../../../src/interfaces/abstracts/exceptions.interface';
import { IRoleRepository } from '../../../../src/interfaces/repositories/role.repository';
import { FindOneRoleUseCase } from '../../../../src/modules/role/use-cases';

describe.only('FindOneRoleUseCase', () => {
  let repository: IRoleRepository;
  let cacheManager: ICacheManager;
  let exceptionService: IExceptionService;
  let findOneRoleUseCase: FindOneRoleUseCase;
  const roleMock = {
    id: '1d3c8230-4664-48da-a076-163b4c268d7e',
    name: 'example',
    permissions: 'example',
  };

  beforeEach(() => {
    const RoleRepositoryMock = jest.fn<IRoleRepository, []>(() => ({
      findOne: jest.fn().mockResolvedValue(roleMock),
    }));

    const CacheManagerMock = jest.fn<ICacheManager, []>(() => ({
      getCachedObject: jest.fn().mockResolvedValue(null),
      setObjectInCache: jest.fn(),
    }));

    const ExceptionServiceMock = jest.fn<IExceptionService, []>(() => ({
      throwNotFoundException: jest.fn().mockResolvedValue(undefined),
    }));

    repository = new RoleRepositoryMock();
    cacheManager = new CacheManagerMock();
    exceptionService = new ExceptionServiceMock();

    findOneRoleUseCase = new FindOneRoleUseCase(
      repository,
      exceptionService,
      cacheManager,
    );
  });

  it('should be defined', () => {
    expect(findOneRoleUseCase).toBeDefined();
  });

  it('should be able to return the object of roles, on success', async () => {
    const roles = await findOneRoleUseCase.execute(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
    );

    expect(roles).toEqual(roleMock);
  });
});
