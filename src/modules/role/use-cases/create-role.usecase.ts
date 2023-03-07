import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IRoleRepository } from '../../../interfaces/repositories/role.repository';
import { CreateRoleDTO } from '../dto/role.dto';
import { RolePresenter } from '../dto/role.presenter';

export class CreateRoleUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IRoleRepository,
  ) {}

  public async execute(role: CreateRoleDTO): Promise<RolePresenter> {
    const createdRole: RolePresenter = new RolePresenter(
      await this.repository.create(role),
    );

    this.logger.log(
      'CreateRoleUseCases execute()',
      'New role have been inserted',
    );

    return createdRole;
  }
}
