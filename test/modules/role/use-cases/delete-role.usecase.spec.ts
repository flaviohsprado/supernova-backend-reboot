import { HttpStatus } from '@nestjs/common';
import { IExceptionService } from '../../../../src/interfaces/abstracts/exceptions.interface';
import { ILogger } from '../../../../src/interfaces/abstracts/logger.interface';
import { IRoleRepository } from '../../../../src/interfaces/repositories/role.repository';
import { DeleteRoleUseCase } from '../../../../src/modules/role/use-cases';

describe.only('DeleteRoleUseCase', () => {
  let logger: ILogger;
  let exceptionService: IExceptionService;
  let repository: IRoleRepository;
  let deleteRoleUseCase: DeleteRoleUseCase;

  beforeEach(() => {
    const LoggerMock = jest.fn<ILogger, []>(() => ({
      log: jest.fn(),
    }));

    const ExceptionServiceMock = jest.fn<IExceptionService, []>(() => ({
      throwNotFoundException: jest.fn().mockReturnValue({
        message: 'Role not found!',
        statusCode: HttpStatus.NOT_FOUND,
      }),
    }));

    const RoleRepositoryMock = jest.fn<IRoleRepository, []>(() => ({
      delete: jest.fn().mockResolvedValue({
        id: '1d3c8230-4664-48da-a076-163b4c268d7e',
        name: 'example',
        permissions: 'example',
      }),
    }));

    logger = new LoggerMock();
    exceptionService = new ExceptionServiceMock();
    repository = new RoleRepositoryMock();

    deleteRoleUseCase = new DeleteRoleUseCase(
      logger,
      repository,
      exceptionService,
    );
  });

  it('should be defined', () => {
    expect(deleteRoleUseCase).toBeDefined();
  });

  it('should be able to delete a role, on success.', async () => {
    const deletedRole = await deleteRoleUseCase.execute(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
    );

    expect(deletedRole).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      name: 'example',
      permissions: 'example',
    });
  });

  it('should be not able to delete a role because the role not exists.', async () => {
    const RoleRepositoryMock = jest.fn<IRoleRepository, []>(() => ({
      delete: jest.fn().mockResolvedValue(undefined),
    }));

    repository = new RoleRepositoryMock();

    deleteRoleUseCase = new DeleteRoleUseCase(
      logger,
      repository,
      exceptionService,
    );

    const deletedRole = await deleteRoleUseCase.execute(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
    );

    expect(deletedRole).toEqual(undefined);
  });
});
