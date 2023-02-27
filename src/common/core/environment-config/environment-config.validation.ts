import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Local = 'local',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  public ENVIRONMENT: Environment;

  @IsBoolean()
  public CLOUD_UPLOAD: boolean;

  @IsString()
  public JWT_SECRET: string;

  @IsString()
  public JWT_EXPIRATION_TIME: string;

  @IsString()
  public DATABASE_HOST: string;

  @IsNumber()
  public DATABASE_PORT: number;

  @IsString()
  public DATABASE_USER: string;

  @IsString()
  public DATABASE_PASSWORD: string;

  @IsString()
  public DATABASE_NAME: string;

  @IsBoolean()
  public DATABASE_SYNCHRONIZE: boolean;

  @IsString()
  public REDIS_HOST: string;

  @IsNumber()
  public REDIS_PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
