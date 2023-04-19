import { IBcryptService } from '../../../interfaces/abstracts/bcrypt.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { IJwtService } from '../../../interfaces/abstracts/jwt.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUserRepository } from '../../../interfaces/repositories/user.repository';
import { User } from '../../user/entities/user.entity';
import { AuthDTO } from '../dto/auth.dto';
import { AuthPresenter } from '../dto/auth.presenter';

export class LoginUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtService: IJwtService,
    private readonly bcryptService: IBcryptService,
    private readonly exceptionService: IExceptionService,
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(credentials: AuthDTO): Promise<AuthPresenter> {
    const userValidated: Omit<User, 'password'> = await this.validateUser(
      credentials.email,
      credentials.password,
    );

    const accessToken = this.jwtService.createToken({
      id: userValidated.id,
    });

    this.logger.log(
      `LoginUseCases execute()`,
      `User ${userValidated.username} logged in!`,
    );

    return new AuthPresenter({ accessToken });
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByKey('email', email);

    if (!user)
      this.exceptionService.throwNotFoundException({
        message: 'User not found!',
      });

    if (await this.bcryptService.checkHash(password, user.password)) {
      delete user.password;

      return user;
    }
  }
}
