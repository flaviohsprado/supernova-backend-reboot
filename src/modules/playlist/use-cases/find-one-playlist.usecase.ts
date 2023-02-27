import { ICacheManager } from '../../../interfaces/abstracts/cache.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { IPlaylistRepository } from '../../../interfaces/repositories/playlist.repository';
import { Playlist } from '../entities/playlist.entity';

export class FindOnePlaylistUseCase {
  constructor(
    private readonly repository: IPlaylistRepository,
    private readonly exceptionService: IExceptionService,
    private readonly cacheManager: ICacheManager,
  ) {}

  public async execute(id: string): Promise<Playlist> {
    const cachedPlaylist = await this.cacheManager.getCachedObject<Playlist>(
      'playlist',
    );

    if (cachedPlaylist) return cachedPlaylist;

    const playlist: Playlist = await this.repository.findOne(id);

    if (!playlist)
      this.exceptionService.throwNotFoundException({
        message: 'Playlist not found',
      });

    await this.cacheManager.setObjectInCache('playlist', playlist);

    return playlist;
  }
}
