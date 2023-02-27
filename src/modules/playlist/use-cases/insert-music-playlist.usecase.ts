import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IMusicRepository } from '../../../interfaces/repositories/music.repository';
import { IPlaylistRepository } from '../../../interfaces/repositories/playlist.repository';
import { Playlist } from '../entities/playlist.entity';

export class InsertMusicPlaylistUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IPlaylistRepository,
    private readonly musicRepository: IMusicRepository,
  ) {}

  public async execute(playlistId: string, musicId: string): Promise<Playlist> {
    const music = await this.musicRepository.findOne(musicId);

    const updatedPlaylist = await this.repository.insertMusic(
      playlistId,
      music,
    );

    this.logger.log(
      'InsertMusicIntoPlaylistUseCases execute()',
      'New playlist have been updated',
    );

    return updatedPlaylist;
  }
}
