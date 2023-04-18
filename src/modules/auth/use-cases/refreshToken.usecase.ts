import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { IJwtService } from '../../../interfaces/abstracts/jwt.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IJwtAuthPayload } from '../../../interfaces/authJwtPayload.interface';
import { IUserRepository } from '../../../interfaces/repositories/user.repository';
import { User } from '../../user/entities/user.entity';
import { AuthPresenter } from '../dto/auth.presenter';

export class RefreshTokenUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtService: IJwtService,
    private readonly exceptionService: IExceptionService,
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(token: string): Promise<AuthPresenter> {
    const { id } = await this.jwtService.checkToken<IJwtAuthPayload>(
      token.replace('Bearer ', ''),
    );

    const userValidated: Omit<User, 'password'> = await this.validateUser(id);

    const accessToken = this.jwtService.createToken({
      id: userValidated.id,
      username: userValidated.username,
      avatar: userValidated.file ? userValidated.file.url : null,
    });

    this.logger.log(
      `RefreshTokenUseCases execute()`,
      `Token have been refreshed!`,
    );

    return new AuthPresenter({ accessToken });
  }

  private async validateUser(id: string) {
    const user = await this.userRepository.findOne(id);

    if (!user)
      this.exceptionService.throwNotFoundException({
        message: 'User not found!',
      });

    return user;
  }
}
