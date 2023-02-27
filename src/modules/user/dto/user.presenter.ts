import { File } from '../../file/entities/file.entity';
import { User } from '../entities/user.entity';

export class UserPresenter {
  public id: string;

  public username: string;

  public email: string;

  public accessToken?: string;

  public file?: File;

  public createdAt?: Date;

  public updatedAt?: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
