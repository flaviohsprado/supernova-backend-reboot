import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SetupDocumentBuilder {
  static for(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Supernova Backend API')
      .setDescription(
        'This is a sample of API capable of handling user authentication, musics, playlists and other features.',
      )
      .setVersion('1.0')
      .addTag('Album')
      .addTag('Artist')
      .addTag('Authentication')
      .addTag('Music')
      .addTag('Playlist')
      .addTag('User')
      .addBearerAuth()
      .addBasicAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}
