import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../../common/core/environment-config/environment-config.module';
import { ExceptionsModule } from '../../common/core/exception/exceptions.module';
import { ExceptionsService } from '../../common/core/exception/exceptions.service';
import { LoggerModule } from '../../common/core/logger/logger.module';
import { LoggerService } from '../../common/core/logger/logger.service';
import { UseCaseProxy } from '../../common/utils/usecase-proxy';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { BcryptService } from '../../services/bcrypt/bcrypt.service';
import { JwtServiceModule } from '../../services/jwt/jwt.module';
import { JwtTokenService } from '../../services/jwt/jwt.service';
import { RepositoriesModule } from '../repositories.proxy.module';
import { UserRepository } from '../user/user.repository';
import { LoginUseCase } from './use-cases/login.usecase';
import { RefreshTokenUseCase } from './use-cases/refreshToken.usecase';

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule,
    ExceptionsModule,
    BcryptModule,
    JwtServiceModule,
    RepositoriesModule,
  ],
})
export class AuthModule {
  static LOGIN_USECASES_PROXY = 'loginUsecasesProxy';
  static REFRESH_TOKEN_USECASES_PROXY = 'refreshTokenUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          inject: [
            LoggerService,
            JwtTokenService,
            BcryptService,
            ExceptionsService,
            UserRepository,
          ],
          provide: AuthModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtService: JwtTokenService,
            bcryptService: BcryptService,
            exceptionService: ExceptionsService,
            userRepository: UserRepository,
          ) =>
            new UseCaseProxy(
              new LoginUseCase(
                logger,
                jwtService,
                bcryptService,
                exceptionService,
                userRepository,
              ),
            ),
        },
        {
          inject: [
            LoggerService,
            JwtTokenService,
            BcryptService,
            ExceptionsService,
            UserRepository,
          ],
          provide: AuthModule.REFRESH_TOKEN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtService: JwtTokenService,
            bcryptService: BcryptService,
            exceptionService: ExceptionsService,
            userRepository: UserRepository,
          ) =>
            new UseCaseProxy(
              new RefreshTokenUseCase(
                logger,
                jwtService,
                exceptionService,
                userRepository,
              ),
            ),
        },
      ],
      exports: [
        AuthModule.LOGIN_USECASES_PROXY,
        AuthModule.REFRESH_TOKEN_USECASES_PROXY,
      ],
    };
  }
}
