import { CreateFileDTO } from 'src/modules/file/dto/file.dto';
import { uuid } from 'uuidv4';
import { IsOptionalString } from '../../../common/decorators/validators/isOptionalString.decorator';
import { IsRequiredString } from '../../../common/decorators/validators/isRequiredString.decorator';

export class CreateUserDTO {
  @IsOptionalString()
  public id?: string;

  @IsRequiredString()
  public username: string;

  @IsOptionalString()
  public email: string;

  @IsRequiredString()
  public password: string;

  @IsOptionalString()
  public file?: CreateFileDTO;

  @IsOptionalString()
  public roleId?: string;

  constructor(props: CreateUserDTO) {
    Object.assign(this, props);
    this.id = uuid();
  }
}

export class UpdateUserDTO {
  @IsOptionalString()
  public username?: string;

  @IsOptionalString()
  public email?: string;

  @IsOptionalString()
  public password?: string;

  @IsOptionalString()
  public file?: CreateFileDTO;

  @IsOptionalString()
  public roleId?: string;
}
