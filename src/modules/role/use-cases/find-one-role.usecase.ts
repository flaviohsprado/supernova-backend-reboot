import { ICacheManager } from '../../../interfaces/abstracts/cache.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { IRoleRepository } from '../../../interfaces/repositories/role.repository';
import { Role } from '../entities/role.entity';

export class FindOneRoleUseCase {
  constructor(
    private readonly repository: IRoleRepository,
    private readonly exceptionService: IExceptionService,
    private readonly cacheManager: ICacheManager,
  ) {}

  public async execute(id: string): Promise<Role> {
    const cachedRole = await this.cacheManager.getCachedObject<Role>('role');

    if (cachedRole) return cachedRole;

    const role: Role = await this.repository.findOne(id);

    if (!role) {
      this.exceptionService.throwNotFoundException({
        message: 'Role not found',
      });
      return;
    }

    await this.cacheManager.setObjectInCache('role', role);

    return role;
  }
}
