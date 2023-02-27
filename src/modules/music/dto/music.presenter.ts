import { AlbumPresenter } from '../../../modules/album/dto/album.presenter';
import { File } from '../../../modules/file/entities/file.entity';

export class MusicPresenter {
  public id: string;

  public title: string;

  public duration: number;

  public createdAt: Date;

  public updatedAt: Date;

  public album: AlbumPresenter;

  public file?: File;

  constructor(props: MusicPresenter) {
    Object.assign(this, props);
  }
}
