import { ApiProperty } from '@nestjs/swagger';
import { File } from '../../file/entities/file.entity';
import { User } from '../entities/user.entity';

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
  public createdAt?: Date;

  @ApiProperty()
  public updatedAt?: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
