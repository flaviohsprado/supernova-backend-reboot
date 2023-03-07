import { HttpStatus } from '@nestjs/common';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IRoleRepository } from '../../../interfaces/repositories/role.repository';
import { Role } from '../entities/role.entity';

export class DeleteRoleUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IRoleRepository,
    private readonly exceptionService: IExceptionService,
  ) {}

  public async execute(id: string): Promise<Role> {
    const roleDeleted = await this.repository.delete(id);

    if (roleDeleted) {
      this.logger.log(
        'DeleteRoleUseCases execute()',
        `Role ${id} have been deleted`,
      );

      return roleDeleted;
    } else {
      this.exceptionService.throwNotFoundException({
        message: 'Role not found!',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }
}
