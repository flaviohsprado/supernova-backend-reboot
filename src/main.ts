import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupContainer } from './common/utils/setupContainer.utils';
import { SetupDocumentBuilder } from './common/utils/setupDocumentBuilder.utils';
import { SetupGlobalFilters } from './common/utils/setupGlobalFilters.utils';
import { SetupGlobalInterceptors } from './common/utils/setupGlobalInterceptors.utils';
import { SetupGlobalPipes } from './common/utils/setupGlobalPipes.utils';

async function main() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const port = process.env.PORT || 3009;

  SetupGlobalFilters.for(app);
  SetupGlobalInterceptors.for(app);
  SetupGlobalPipes.for(app);
  SetupDocumentBuilder.for(app);
  SetupContainer.for(app, AppModule);

  await app.listen(port);
}

main();
