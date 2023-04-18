import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EnvironmentConfigModule } from './common/core/environment-config/environment-config.module';
import { ExceptionsModule } from './common/core/exception/exceptions.module';
import { LoggerModule } from './common/core/logger/logger.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from './common/interceptor/transformResponse.interceptor';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { LocalStrategy } from './common/strategies/local.strategy';
import { ControllersModule } from './modules/controllers.proxy.module';
import { RepositoriesModule } from './modules/repositories.proxy.module';
import { BcryptModule } from './services/bcrypt/bcrypt.module';
import { JwtServiceModule } from './services/jwt/jwt.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'documentation'),
      renderPath: '/documentation',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'coverage/lcov-report'),
      renderPath: '/coverage',
    }),
    PassportModule,
    LoggerModule,
    ExceptionsModule,
    JwtServiceModule,
    BcryptModule,
    EnvironmentConfigModule,
    ControllersModule,
    RepositoriesModule,
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
