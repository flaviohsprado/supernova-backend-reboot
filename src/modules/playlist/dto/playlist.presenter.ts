import { MusicPresenter } from 'src/modules/music/dto/music.presenter';
import { User } from 'src/modules/user/entities/user.entity';
import { Playlist } from '../entities/playlist.entity';

export class PlaylistPresenter {
  public id: string;

  public title: string;

  public isPublic: boolean;

  public numberOfSongs?: number;

  public duration?: number;

  public createdAt?: Date;

  public updatedAt?: Date;

  public user: User;

  public musics?: MusicPresenter[];

  public file?: File;

  constructor(props: Playlist) {
    Object.assign(this, props);
  }
}
