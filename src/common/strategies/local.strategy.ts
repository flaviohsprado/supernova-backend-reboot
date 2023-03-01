import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthModule } from '../../modules/auth/auth.module';
import { LoginUseCase } from '../../modules/auth/use-cases/login.usecase';
import { ExceptionsService } from '../core/exception/exceptions.service';
import { LoggerService } from '../core/logger/logger.service';
import { UseCaseProxy } from '../utils/usecase-proxy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCase>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      passReqToCallback: true,
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string): Promise<any> {
    if (!email || !password) {
      this.logger.warn(
        'LocalStrategy',
        `Email or password is missing, BadRequestException`,
      );
      this.exceptionService.throwUnauthorizedException({
        message: 'Email or password is missing.',
      });
    }

    const user = await this.loginUsecaseProxy
      .getInstance()
      .execute({ email, password });

    if (!user) {
      this.logger.warn('LocalStrategy', `Invalid email or password`);

      this.exceptionService.throwUnauthorizedException({
        message: 'Invalid email or password.',
      });
    }

    return user;
  }
}
