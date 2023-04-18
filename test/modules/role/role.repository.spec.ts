import { IRoleRepository } from '../../../src/interfaces/repositories/role.repository';

describe.only('RoleRepository', () => {
  let repository: IRoleRepository;

  const roleMock = {
    id: '1d3c8230-4664-48da-a076-163b4c268d7e',
    name: 'example',
    permissions: 'example',
  };

  beforeEach(() => {
    const RoleRepositoryMock = jest.fn<IRoleRepository, []>(() => ({
      findAll: jest.fn().mockResolvedValue([roleMock]),
      findOne: jest.fn().mockResolvedValue(roleMock),
      create: jest.fn().mockResolvedValue(roleMock),
      update: jest.fn().mockResolvedValue(roleMock),
      delete: jest.fn().mockResolvedValue(roleMock),
    }));

    repository = new RoleRepositoryMock();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be able to return an list of roles, on success', async () => {
    const roles = await repository.findAll();

    expect(roles).toEqual([
      {
        id: '1d3c8230-4664-48da-a076-163b4c268d7e',
        name: 'example',
        permissions: 'example',
      },
    ]);
  });

  it('should be able to return an object of role, on success', async () => {
    const role = await repository.findOne(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
    );

    expect(role).toEqual({
      id: '1d3c8230-4664-48da-a076-163b4c268d7e',
      name: 'example',
      permissions: 'example',
    });
  });

  it('should be able to create a new role, on success', async () => {
    const createdRole = await repository.create({
      name: 'example',
      permissions: 'example',
    });

    expect(createdRole).toEqual(roleMock);
  });

  it('should be able to update an exists role, on success', async () => {
    const updatedRole = await repository.update(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
      {
        name: 'example',
        permissions: 'example',
      },
    );

    expect(updatedRole).toEqual(roleMock);
  });

  it('should be able to delete an exists role, on success', async () => {
    const deletedRole = await repository.delete(
      '1d3c8230-4664-48da-a076-163b4c268d7e',
    );

    expect(deletedRole).toEqual(roleMock);
  });
});
