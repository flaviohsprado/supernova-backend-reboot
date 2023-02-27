import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IArtistRepository } from '../../../interfaces/repositories/artist.repository';
import { CreateArtistDTO } from '../dto/artist.dto';
import { ArtistPresenter } from '../dto/artist.presenter';

export class CreateArtistUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IArtistRepository,
  ) {}

  public async execute(artist: CreateArtistDTO): Promise<ArtistPresenter> {
    const createdArtist: ArtistPresenter = new ArtistPresenter(
      await this.repository.create(artist),
    );

    this.logger.log(
      'CreateArtistUseCases execute()',
      'New artist have been inserted',
    );

    return createdArtist;
  }
}
