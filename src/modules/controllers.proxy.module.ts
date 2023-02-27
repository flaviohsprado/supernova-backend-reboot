import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule.register(),
    AuthModule.register(),
    //ArtistModule.register(),
    //AlbumModule.register(),
    //MusicModule.register(),
    //PlaylistModule.register(),
  ],
  providers: [
    UserController,
    //AuthController,
    //ArtistController,
    //AlbumController,
    //MusicController,
    //PlaylistController,
  ],
  exports: [
    UserModule.register(),
    AuthModule.register(),
    //ArtistModule.register(),
    //AlbumModule.register(),
    //MusicModule.register(),
    //PlaylistModule.register(),
  ],
})
export class ControllersModule {}
