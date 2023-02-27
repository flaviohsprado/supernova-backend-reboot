import { ICacheManager } from '../../../interfaces/abstracts/cache.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { IArtistRepository } from '../../../interfaces/repositories/artist.repository';
import { Artist } from '../entities/artist.entity';

export class FindOneArtistUseCase {
  constructor(
    private readonly repository: IArtistRepository,
    private readonly exceptionService: IExceptionService,
    private readonly cacheManager: ICacheManager,
  ) {}

  public async execute(id: string): Promise<Artist> {
    const cachedArtist = await this.cacheManager.getCachedObject<Artist>(
      'artist',
    );

    if (cachedArtist) return cachedArtist;

    const artist: Artist = await this.repository.findOne(id);

    if (!artist)
      this.exceptionService.throwNotFoundException({
        message: 'Artist not found',
      });

    await this.cacheManager.setObjectInCache('artist', artist);

    return artist;
  }
}
