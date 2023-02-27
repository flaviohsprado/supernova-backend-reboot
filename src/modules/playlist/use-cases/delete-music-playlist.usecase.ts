import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IPlaylistRepository } from '../../../interfaces/repositories/playlist.repository';
import { Playlist } from '../entities/playlist.entity';

export class DeleteMusicPlaylistUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IPlaylistRepository,
  ) {}

  public async execute(playlistId: string, musicId: string): Promise<Playlist> {
    const updatedPlaylist = await this.repository.removeMusic(
      playlistId,
      musicId,
    );

    this.logger.log(
      'DeleteMusicFromPlaylistUseCases execute()',
      'New playlist have been updated',
    );

    return updatedPlaylist;
  }
}
