import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../../common/core/environment-config/environment-config.module';
import { EnvironmentConfigService } from '../../common/core/environment-config/environment-config.service';
import { ExceptionsModule } from '../../common/core/exception/exceptions.module';
import { ExceptionsService } from '../../common/core/exception/exceptions.service';
import { LoggerModule } from '../../common/core/logger/logger.module';
import { LoggerService } from '../../common/core/logger/logger.service';
import { UseCaseProxy } from '../../common/utils/usecase-proxy';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { BcryptService } from '../../services/bcrypt/bcrypt.service';
import { JwtServiceModule } from '../../services/jwt/jwt.module';
import { JwtTokenService } from '../../services/jwt/jwt.service';
import { CacheConfigModule } from '../../services/redis/cache.module';
import { CacheService } from '../../services/redis/cache.service';
import { S3ConfigModule } from '../../services/s3/s3.module';
import { S3Service } from '../../services/s3/s3.service';
import { FileRepository } from '../file/file.repository';
import { RepositoriesModule } from '../repositories.proxy.module';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUserUseCase,
  FindOneUserUseCase,
  FindUserByKeyUseCase,
  UpdateUserFileUseCase,
  UpdateUserUseCase,
} from './use-cases';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    BcryptModule,
    ExceptionsModule,
    CacheConfigModule,
    JwtServiceModule,
    S3ConfigModule,
  ],
})
export class UserModule {
  static GET_USER_USECASES_PROXY = 'getUserUsecasesProxy';
  static GET_USERS_USECASES_PROXY = 'getUsersUsecasesProxy';
  static FIND_USER_BY_KEY_USECASES_PROXY = 'findUserByKeyUsecasesProxy';
  static POST_USER_USECASES_PROXY = 'postUserUsecasesProxy';
  static PUT_USER_USECASES_PROXY = 'putUserUsecasesProxy';
  static PUT_USER_FILE_USECASES_PROXY = 'putUserFileUsecasesProxy';
  static DELETE_USER_USECASES_PROXY = 'deleteUserUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UserModule,
      providers: [
        {
          inject: [UserRepository, CacheService],
          provide: UserModule.GET_USERS_USECASES_PROXY,
          useFactory: (
            repository: UserRepository,
            cacheService: CacheService,
          ) =>
            new UseCaseProxy(new FindAllUserUseCase(repository, cacheService)),
        },
        {
          inject: [UserRepository, ExceptionsService, CacheService],
          provide: UserModule.GET_USER_USECASES_PROXY,
          useFactory: (
            repository: UserRepository,
            exceptionService: ExceptionsService,
            cacheService: CacheService,
          ) =>
            new UseCaseProxy(
              new FindOneUserUseCase(
                repository,
                exceptionService,
                cacheService,
              ),
            ),
        },
        {
          inject: [UserRepository, ExceptionsService, CacheService],
          provide: UserModule.FIND_USER_BY_KEY_USECASES_PROXY,
          useFactory: (
            repository: UserRepository,
            exceptionService: ExceptionsService,
            cacheService: CacheService,
          ) =>
            new UseCaseProxy(
              new FindUserByKeyUseCase(
                repository,
                exceptionService,
                cacheService,
              ),
            ),
        },
        {
          inject: [
            LoggerService,
            UserRepository,
            FileRepository,
            BcryptService,
            JwtTokenService,
            ExceptionsService,
            S3Service,
            EnvironmentConfigService,
          ],
          provide: UserModule.POST_USER_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: UserRepository,
            fileRepository: FileRepository,
            bcryptService: BcryptService,
            jwtService: JwtTokenService,
            exceptionService: ExceptionsService,
            s3Service: S3Service,
            config: EnvironmentConfigService,
          ) =>
            new UseCaseProxy(
              new CreateUserUseCase(
                logger,
                repository,
                fileRepository,
                bcryptService,
                jwtService,
                exceptionService,
                s3Service,
                config,
              ),
            ),
        },
        {
          inject: [
            LoggerService,
            UserRepository,
            BcryptService,
            ExceptionsService,
          ],
          provide: UserModule.PUT_USER_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: UserRepository,
            bcryptService: BcryptService,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new UpdateUserUseCase(
                logger,
                repository,
                bcryptService,
                exceptionService,
              ),
            ),
        },
        {
          inject: [
            LoggerService,
            UserRepository,
            FileRepository,
            S3Service,
            EnvironmentConfigService,
          ],
          provide: UserModule.PUT_USER_FILE_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: UserRepository,
            fileRepository: FileRepository,
            s3Service: S3Service,
            config: EnvironmentConfigService,
          ) =>
            new UseCaseProxy(
              new UpdateUserFileUseCase(
                logger,
                repository,
                fileRepository,
                s3Service,
                config,
              ),
            ),
        },
        {
          inject: [
            LoggerService,
            UserRepository,
            ExceptionsService,
            S3Service,
            EnvironmentConfigService,
            FileRepository,
          ],
          provide: UserModule.DELETE_USER_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: UserRepository,
            exceptionService: ExceptionsService,
            s3Service: S3Service,
            config: EnvironmentConfigService,
            fileRepository: FileRepository,
          ) =>
            new UseCaseProxy(
              new DeleteUserUseCase(
                logger,
                repository,
                exceptionService,
                s3Service,
                config,
                fileRepository,
              ),
            ),
        },
      ],
      exports: [
        UserModule.GET_USERS_USECASES_PROXY,
        UserModule.GET_USER_USECASES_PROXY,
        UserModule.FIND_USER_BY_KEY_USECASES_PROXY,
        UserModule.POST_USER_USECASES_PROXY,
        UserModule.PUT_USER_USECASES_PROXY,
        UserModule.PUT_USER_FILE_USECASES_PROXY,
        UserModule.DELETE_USER_USECASES_PROXY,
      ],
    };
  }
}
