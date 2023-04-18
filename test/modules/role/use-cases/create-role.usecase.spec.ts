import { ILogger } from '../../../../src/interfaces/abstracts/logger.interface';
import { IRoleRepository } from '../../../../src/interfaces/repositories/role.repository';
import { CreateRoleUseCase } from '../../../../src/modules/role/use-cases';

describe.only('CreateRoleUseCase', () => {
  let logger: ILogger;
  let repository: IRoleRepository;
  let createRoleUseCase: CreateRoleUseCase;

  beforeEach(() => {
    const LoggerMock = jest.fn<ILogger, []>(() => ({
      log: jest.fn(),
    }));

    const RoleRepositoryMock = jest.fn<IRoleRepository, []>(() => ({
      create: jest.fn().mockResolvedValue({
        id: '1d3c8230-4664-48da-a076-163b4c268d7e',
        name: 'example',
        permissions: 'example',
      }),
    }));

    logger = new LoggerMock();
    repository = new RoleRepositoryMock();

    createRoleUseCase = new CreateRoleUseCase(logger, repository);
  });

  it('should be defined', () => {
    expect(createRoleUseCase).toBeDefined();
  });

  it('should be able to create a new role, on success', async () => {
    const createdRole = await createRoleUseCase.execute({
      name: 'example',
      permissions: 'example',
    });

    expect(createdRole).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      name: 'example',
      permissions: 'example',
    });
  });
});
