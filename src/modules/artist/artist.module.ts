import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../../common/core/environment-config/environment-config.module';
import { ExceptionsModule } from '../../common/core/exception/exceptions.module';
import { ExceptionsService } from '../../common/core/exception/exceptions.service';
import { LoggerModule } from '../../common/core/logger/logger.module';
import { LoggerService } from '../../common/core/logger/logger.service';
import { UseCaseProxy } from '../../common/utils/usecase-proxy';
import { CacheConfigModule } from '../../services/redis/cache.module';
import { CacheService } from '../../services/redis/cache.service';
import { RepositoriesModule } from '../repositories.proxy.module';
import { ArtistRepository } from './artist.repository';
import {
  CreateArtistUseCase,
  DeleteArtistUseCase,
  FindAllArtistUseCase,
  FindOneArtistUseCase,
  UpdateArtistUseCase,
} from './use-cases';

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    CacheConfigModule,
  ],
})
export class ArtistModule {
  static GET_ARTIST_USECASES_PROXY = 'getArtistUsecasesProxy';
  static GET_ARTISTS_USECASES_PROXY = 'getArtistsUsecasesProxy';
  static POST_ARTIST_USECASES_PROXY = 'postArtistUsecasesProxy';
  static DELETE_ARTIST_USECASES_PROXY = 'deleteArtistUsecasesProxy';
  static PUT_ARTIST_USECASES_PROXY = 'putArtistUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: ArtistModule,
      providers: [
        {
          inject: [ArtistRepository, CacheService],
          provide: ArtistModule.GET_ARTISTS_USECASES_PROXY,
          useFactory: (
            repository: ArtistRepository,
            cacheService: CacheService,
          ) =>
            new UseCaseProxy(
              new FindAllArtistUseCase(repository, cacheService),
            ),
        },
        {
          inject: [ArtistRepository, ExceptionsService, CacheService],
          provide: ArtistModule.GET_ARTIST_USECASES_PROXY,
          useFactory: (
            repository: ArtistRepository,
            exceptionService: ExceptionsService,
            cacheService: CacheService,
          ) =>
            new UseCaseProxy(
              new FindOneArtistUseCase(
                repository,
                exceptionService,
                cacheService,
              ),
            ),
        },
        {
          inject: [LoggerService, ArtistRepository],
          provide: ArtistModule.POST_ARTIST_USECASES_PROXY,
          useFactory: (logger: LoggerService, repository: ArtistRepository) =>
            new UseCaseProxy(new CreateArtistUseCase(logger, repository)),
        },
        {
          inject: [LoggerService, ArtistRepository],
          provide: ArtistModule.PUT_ARTIST_USECASES_PROXY,
          useFactory: (logger: LoggerService, repository: ArtistRepository) =>
            new UseCaseProxy(new UpdateArtistUseCase(logger, repository)),
        },
        {
          inject: [LoggerService, ArtistRepository, ExceptionsService],
          provide: ArtistModule.DELETE_ARTIST_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: ArtistRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new DeleteArtistUseCase(logger, repository, exceptionService),
            ),
        },
      ],
      exports: [
        ArtistModule.GET_ARTISTS_USECASES_PROXY,
        ArtistModule.GET_ARTIST_USECASES_PROXY,
        ArtistModule.POST_ARTIST_USECASES_PROXY,
        ArtistModule.PUT_ARTIST_USECASES_PROXY,
        ArtistModule.DELETE_ARTIST_USECASES_PROXY,
      ],
    };
  }
}
