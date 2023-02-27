import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from '../filters/exception.filter';

export class SetupGlobalFilters {
  static for(app: INestApplication) {
    app.useGlobalFilters(new AllExceptionsFilter());
  }
}
