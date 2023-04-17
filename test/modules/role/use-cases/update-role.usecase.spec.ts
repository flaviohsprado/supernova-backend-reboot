import { ILogger } from '../../../../src/interfaces/abstracts/logger.interface';
import { IRoleRepository } from '../../../../src/interfaces/repositories/role.repository';
import { UpdateRoleUseCase } from '../../../../src/modules/role/use-cases';

describe.only('UpdateRoleUseCase', () => {
  let logger: ILogger;
  let repository: IRoleRepository;
  let updateRoleUseCase: UpdateRoleUseCase;

  beforeEach(() => {
    const LoggerMock = jest.fn<ILogger, []>(() => ({
      log: jest.fn(),
    }));

    const RoleRepositoryMock = jest.fn<IRoleRepository, []>(() => ({
      update: jest.fn().mockResolvedValue({
        id: '1d3c8230-4664-48da-a076-163b4c268d7e',
        name: 'example01',
        permissions: 'example',
      }),
    }));

    logger = new LoggerMock();
    repository = new RoleRepositoryMock();

    updateRoleUseCase = new UpdateRoleUseCase(logger, repository);
  });

  it('should be defined', () => {
    expect(updateRoleUseCase).toBeDefined();
  });

  it('should be able to update an exists role, on success', async () => {
    const updatedRole = await updateRoleUseCase.execute(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
      {
        name: 'example01',
        permissions: 'example',
      },
    );

    expect(updatedRole).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      name: 'example01',
      permissions: 'example',
    });
  });
});
