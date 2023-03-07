import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../services/typeorm/typeorm.module';
import { AlbumRepository } from './album/album.repository';
import { Album } from './album/entities/album.entity';
import { ArtistRepository } from './artist/artist.repository';
import { Artist } from './artist/entities/artist.entity';
import { File } from './file/entities/file.entity';
import { FileRepository } from './file/file.repository';
import { Music } from './music/entities/music.entity';
import { MusicRepository } from './music/music.repository';
import { Playlist } from './playlist/entities/playlist.entity';
import { PlaylistRepository } from './playlist/playlist.repository';
import { Role } from './role/entities/role.entity';
import { RoleRepository } from './role/role.repository';
import { User } from './user/entities/user.entity';
import { UserRepository } from './user/user.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      User,
      Role,
      Artist,
      Album,
      File,
      Music,
      Playlist,
    ]),
  ],
  providers: [
    UserRepository,
    RoleRepository,
    ArtistRepository,
    AlbumRepository,
    FileRepository,
    MusicRepository,
    PlaylistRepository,
  ],
  exports: [
    UserRepository,
    RoleRepository,
    ArtistRepository,
    AlbumRepository,
    FileRepository,
    MusicRepository,
    PlaylistRepository,
  ],
})
export class RepositoriesModule {}
