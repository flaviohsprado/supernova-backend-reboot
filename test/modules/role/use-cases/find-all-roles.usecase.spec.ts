import { ICacheManager } from '../../../../src/interfaces/abstracts/cache.interface';
import { IRoleRepository } from '../../../../src/interfaces/repositories/role.repository';
import { FindAllRoleUseCase } from '../../../../src/modules/role/use-cases';

describe.only('FindAllRolesUseCase', () => {
  let repository: IRoleRepository;
  let cacheManager: ICacheManager;
  let findAllRolesUseCase: FindAllRoleUseCase;
  const rolesMock = [
    {
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      name: 'example',
      permissions: 'example',
    },
  ];

  beforeEach(() => {
    const RoleRepositoryMock = jest.fn<IRoleRepository, []>(() => ({
      findAll: jest.fn().mockResolvedValue(rolesMock),
    }));

    const CacheManagerMock = jest.fn<ICacheManager, []>(() => ({
      getCachedObject: jest.fn().mockResolvedValue(null),
      setObjectInCache: jest.fn(),
    }));

    repository = new RoleRepositoryMock();
    cacheManager = new CacheManagerMock();

    findAllRolesUseCase = new FindAllRoleUseCase(repository, cacheManager);
  });

  it('should be defined', () => {
    expect(findAllRolesUseCase).toBeDefined();
  });

  it('should be able to return the list of roles, on success', async () => {
    const roles = await findAllRolesUseCase.execute();

    expect(roles).toEqual(rolesMock);
  });
});
