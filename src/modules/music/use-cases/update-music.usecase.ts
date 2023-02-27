import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IMusicRepository } from '../../../interfaces/repositories/music.repository';
import { UpdateMusicDTO } from '../dto/music.dto';
import { Music } from '../entities/music.entity';

export class UpdateMusicUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IMusicRepository,
  ) {}

  public async execute(id: string, music: UpdateMusicDTO): Promise<Music> {
    const updatedMusic = await this.repository.update(id, music);

    this.logger.log(
      'UpdateMusicUseCases execute()',
      `Music ${id} have been updated`,
    );

    return updatedMusic;
  }
}
