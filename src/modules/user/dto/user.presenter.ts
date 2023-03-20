import { ApiProperty } from '@nestjs/swagger';
import { format } from 'date-fns';
import { File } from '../../file/entities/file.entity';
import { Role } from '../../role/entities/role.entity';

export class UserPresenter {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public accessToken?: string;

  @ApiProperty()
  public file?: File;

  @ApiProperty()
  public role?: Role;

  @ApiProperty()
  public createdAt?: Date | string;

  @ApiProperty()
  public updatedAt?: Date | string;

  constructor(user?: UserPresenter) {
    this.id = user?.id;
    this.username = user?.username;
    this.email = user?.email;
    this.accessToken = user?.accessToken;
    this.file = user?.file;
    this.role = user?.role;
    this.createdAt = format(new Date(user?.createdAt), 'dd/MM/yyyy HH:mm:ss');
    this.updatedAt = format(new Date(user?.updatedAt), 'dd/MM/yyyy HH:mm:ss');
  }
}
