import { DynamicModule, Module } from '@nestjs/common';
import { ExceptionsModule } from '../../common/core/exception/exceptions.module';
import { ExceptionsService } from '../../common/core/exception/exceptions.service';
import { LoggerModule } from '../../common/core/logger/logger.module';
import { LoggerService } from '../../common/core/logger/logger.service';
import { UseCaseProxy } from '../../common/utils/usecase-proxy';
import { CacheConfigModule } from '../../services/redis/cache.module';
import { CacheService } from '../../services/redis/cache.service';
import { RepositoriesModule } from '../repositories.proxy.module';
import { RoleRepository } from './role.repository';
import {
  CreateRoleUseCase,
  DeleteRoleUseCase,
  FindAllRoleUseCase,
  FindOneRoleUseCase,
  UpdateRoleUseCase,
} from './use-cases';

@Module({
  imports: [
    LoggerModule,
    RepositoriesModule,
    ExceptionsModule,
    CacheConfigModule,
  ],
})
export class RoleModule {
  static GET_ROLE_USECASES_PROXY = 'getRoleUsecasesProxy';
  static GET_ROLES_USECASES_PROXY = 'getRolesUsecasesProxy';
  static POST_ROLE_USECASES_PROXY = 'postRoleUsecasesProxy';
  static PUT_ROLE_USECASES_PROXY = 'putRoleUsecasesProxy';
  static DELETE_ROLE_USECASES_PROXY = 'deleteRoleUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: RoleModule,
      providers: [
        {
          inject: [RoleRepository, CacheService],
          provide: RoleModule.GET_ROLES_USECASES_PROXY,
          useFactory: (
            repository: RoleRepository,
            cacheService: CacheService,
          ) =>
            new UseCaseProxy(new FindAllRoleUseCase(repository, cacheService)),
        },
        {
          inject: [RoleRepository, ExceptionsService, CacheService],
          provide: RoleModule.GET_ROLE_USECASES_PROXY,
          useFactory: (
            repository: RoleRepository,
            exceptionService: ExceptionsService,
            cacheService: CacheService,
          ) =>
            new UseCaseProxy(
              new FindOneRoleUseCase(
                repository,
                exceptionService,
                cacheService,
              ),
            ),
        },
        {
          inject: [LoggerService, RoleRepository],
          provide: RoleModule.POST_ROLE_USECASES_PROXY,
          useFactory: (logger: LoggerService, repository: RoleRepository) =>
            new UseCaseProxy(new CreateRoleUseCase(logger, repository)),
        },
        {
          inject: [LoggerService, RoleRepository, ExceptionsService],
          provide: RoleModule.PUT_ROLE_USECASES_PROXY,
          useFactory: (logger: LoggerService, repository: RoleRepository) =>
            new UseCaseProxy(new UpdateRoleUseCase(logger, repository)),
        },
        {
          inject: [LoggerService, RoleRepository, ExceptionsService],
          provide: RoleModule.DELETE_ROLE_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: RoleRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new DeleteRoleUseCase(logger, repository, exceptionService),
            ),
        },
      ],
      exports: [
        RoleModule.GET_ROLES_USECASES_PROXY,
        RoleModule.GET_ROLE_USECASES_PROXY,
        RoleModule.POST_ROLE_USECASES_PROXY,
        RoleModule.PUT_ROLE_USECASES_PROXY,
        RoleModule.DELETE_ROLE_USECASES_PROXY,
      ],
    };
  }
}
