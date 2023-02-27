import { INestApplication, ValidationPipe } from '@nestjs/common';

export class SetupGlobalPipes {
  static for(app: INestApplication) {
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
  }
}
