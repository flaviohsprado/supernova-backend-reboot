import { AuthDTO } from '../../modules/auth/dto/auth.dto';
import { AuthPresenter } from '../../modules/auth/dto/auth.presenter';
import { User } from '../../modules/user/entities/user.entity';

export interface IAuthRepository {
  login(credentials: AuthDTO): Promise<AuthPresenter>;

  validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>>;
}
