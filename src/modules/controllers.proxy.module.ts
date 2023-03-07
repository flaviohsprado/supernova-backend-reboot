import { Module } from '@nestjs/common';
import { ArtistController } from './artist/artist.controller';
import { ArtistModule } from './artist/artist.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule.register(),
    RoleModule.register(),
    AuthModule.register(),
    ArtistModule.register(),
    //AlbumModule.register(),
    //MusicModule.register(),
    //PlaylistModule.register(),
  ],
  controllers: [
    UserController,
    RoleController,
    AuthController,
    ArtistController,
    //AlbumController,
    //MusicController,
    //PlaylistController,
  ],
  exports: [
    UserModule.register(),
    RoleModule.register(),
    AuthModule.register(),
    ArtistModule.register(),
    //AlbumModule.register(),
    //MusicModule.register(),
    //PlaylistModule.register(),
  ],
})
export class ControllersModule {}
