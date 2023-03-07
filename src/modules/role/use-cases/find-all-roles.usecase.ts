import { ICacheManager } from '../../../interfaces/abstracts/cache.interface';
import { IRoleRepository } from '../../../interfaces/repositories/role.repository';
import { Role } from '../entities/role.entity';

export class FindAllRoleUseCase {
  constructor(
    private readonly repository: IRoleRepository,
    private readonly cacheManager: ICacheManager,
  ) {}

  public async execute(): Promise<Role[]> {
    const cachedRoles = await this.cacheManager.getCachedObject<Role[]>(
      'roles',
    );

    if (cachedRoles) return cachedRoles;

    const roles = await this.repository.findAll();

    await this.cacheManager.setObjectInCache('roles', roles);

    return roles;
  }
}
