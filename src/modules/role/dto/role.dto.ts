import { IsRequiredString } from '../../../common/decorators/validators/isRequiredString.decorator';

export class CreateRoleDTO {
  @IsRequiredString()
  name: string;

  @IsRequiredString()
  permissions: string;

  constructor(role: CreateRoleDTO) {
    Object.assign(this, role);
  }
}

export class UpdateRoleDTO {
  @IsRequiredString()
  name: string;

  @IsRequiredString()
  permissions: string;

  constructor(role: UpdateRoleDTO) {
    Object.assign(this, role);
  }
}
