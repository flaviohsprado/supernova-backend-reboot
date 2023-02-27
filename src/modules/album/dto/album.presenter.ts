import { Artist } from '../../../modules/artist/entities/artist.entity';
import { File } from '../../../modules/file/entities/file.entity';
import { Music } from '../../../modules/music/entities/music.entity';
import { Album } from '../entities/album.entity';

export class AlbumPresenter {
  public id: string;

  public title: string;

  public releaseDate?: Date;

  public numberOfSongs?: number;

  public duration?: number;

  public artist?: Artist;

  public createdAt?: Date;

  public updatedAt?: Date;

  public file?: File;

  public musics?: Music[];

  constructor(album: Album) {
    Object.assign(this, album);

    console.log('album', album);

    this.releaseDate = new Date(this.releaseDate);
  }
}
