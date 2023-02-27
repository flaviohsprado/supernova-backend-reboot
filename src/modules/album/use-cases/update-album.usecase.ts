import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IAlbumRepository } from '../../../interfaces/repositories/album.repository';
import { UpdateAlbumDTO } from '../dto/album.dto';
import { Album } from '../entities/album.entity';

export class UpdateAlbumUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IAlbumRepository,
  ) {}

  public async execute(id: string, album: UpdateAlbumDTO): Promise<Album> {
    const updatedAlbum = await this.repository.update(id, album);

    this.logger.log(
      'UpdateAlbumUseCases execute()',
      `Album ${id} have been updated`,
    );

    return updatedAlbum;
  }
}
