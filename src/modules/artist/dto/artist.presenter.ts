import { Album } from '../../../modules/album/entities/album.entity';
import { Artist } from '../entities/artist.entity';

export class ArtistPresenter {
  public id: string;

  public name: string;

  public monthlyListeners?: number;

  public createdAt?: Date;

  public updatedAt?: Date;

  public albums?: Album[];

  constructor(artist: Artist) {
    Object.assign(this, artist);
  }
}
