import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';

export class RolePresenter {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public permissions: string;

  constructor(role: Role) {
    Object.assign(this, role);
  }
}
