import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPlaylistRepository } from 'src/interfaces/repositories/playlist.repository';
import { Repository } from 'typeorm';
import { Music } from '../music/entities/music.entity';
import { CreatePlaylistDTO, UpdatePlaylistDTO } from './dto/playlist.dto';
import { Playlist } from './entities/playlist.entity';

@Injectable()
export class PlaylistRepository implements IPlaylistRepository {
  constructor(
    @InjectRepository(Playlist)
    private readonly repository: Repository<Playlist>,
  ) {}

  public async findAll(userId?: string): Promise<Playlist[]> {
    return this.repository.find({
      where: { userId },
      relations: [
        'user',
        'user.file',
        'musicToPlaylists',
        'musicToPlaylists.file',
        'musicToPlaylists.album',
        'musicToPlaylists.album.artist',
        'file',
      ],
    });
  }

  public async findOne(id: string): Promise<Playlist> {
    return await this.repository.findOne({
      where: { id },
      relations: [
        'user',
        'user.file',
        'musicToPlaylists',
        'musicToPlaylists.album',
        'musicToPlaylists.album.artist',
        'musicToPlaylists.file',
        'file',
      ],
    });
  }

  public async create(playlist: CreatePlaylistDTO): Promise<Playlist> {
    const newPlaylist = this.repository.create(playlist);

    newPlaylist.musicToPlaylists = [];

    return this.repository.save(newPlaylist);
  }

  public async insertMusic(
    playlistId: string,
    music: Music,
  ): Promise<Playlist> {
    const playlist = await this.repository.findOne({
      where: { id: playlistId },
      relations: ['musics'],
    });

    playlist.musicToPlaylists = [...playlist.musicToPlaylists, music];

    return this.repository.save(playlist);
  }

  public async removeMusic(
    playlistId: string,
    musicId: string,
  ): Promise<Playlist> {
    const playlist = await this.repository.findOne({
      where: { id: playlistId },
      relations: ['musicToPlaylists'],
    });

    playlist.musicToPlaylists = playlist.musicToPlaylists.filter(
      (music) => music.id !== musicId,
    );

    return this.repository.save(playlist);
  }

  public async update(
    id: string,
    playlist: UpdatePlaylistDTO,
  ): Promise<Playlist> {
    const updatePlaylist = this.repository.create({
      ...playlist,
      id,
    });
    return this.repository.save(updatePlaylist);
  }

  public async delete(id: string): Promise<any> {
    const user = await this.repository.findOne({ where: { id } });

    if (user) {
      this.repository.delete(id);
      return user;
    }
  }
}
