import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IRoleRepository } from '../../../interfaces/repositories/role.repository';
import { UpdateRoleDTO } from '../dto/role.dto';
import { Role } from '../entities/role.entity';

export class UpdateRoleUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IRoleRepository,
  ) {}

  public async execute(id: string, role: UpdateRoleDTO): Promise<Role> {
    const updatedRole = await this.repository.update(id, role);

    this.logger.log(
      'UpdateRoleUseCases execute()',
      `Role ${id} have been updated`,
    );

    return updatedRole;
  }
}
