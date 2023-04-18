import { INestApplication } from '@nestjs/common';
import * as compression from 'compression';

export class SetupCompression {
  public static async for(app: INestApplication): Promise<void> {
    await app.use(compression());
  }
}
