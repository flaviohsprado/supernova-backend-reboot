import { ICacheManager } from '../../../interfaces/abstracts/cache.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { IMusicRepository } from '../../../interfaces/repositories/music.repository';
import { Music } from '../entities/music.entity';

export class FindOneMusicUseCase {
  constructor(
    private readonly repository: IMusicRepository,
    private readonly exceptionService: IExceptionService,
    private readonly cacheManager: ICacheManager,
  ) {}

  public async execute(id: string): Promise<Music> {
    const cachedMusic = await this.cacheManager.getCachedObject<Music>('music');

    if (cachedMusic) return cachedMusic;

    const music: Music = await this.repository.findOne(id);

    if (!music)
      this.exceptionService.throwNotFoundException({
        message: 'Music not found',
      });

    await this.cacheManager.setObjectInCache('music', music);

    return music;
  }
}
