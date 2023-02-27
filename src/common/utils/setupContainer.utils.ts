import { DynamicModule, INestApplication, Type } from '@nestjs/common';
import { useContainer } from 'class-validator';

export class SetupContainer {
  static for(app: INestApplication, appModule: DynamicModule | Type<unknown>) {
    useContainer(app.select(appModule), { fallbackOnErrors: true });
  }
}
