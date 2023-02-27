import { Playlist } from 'src/modules/playlist/entities/playlist.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsOptionalNumberColumn } from '../../../common/decorators/columns/isOptionalnumberColumn.decorator';
import { IsRequiredStringColumn } from '../../../common/decorators/columns/isRequiredStringColumn.decorator';
import { Album } from '../../../modules/album/entities/album.entity';
import { File } from '../../../modules/file/entities/file.entity';
import { Music } from './music.entity';

@Entity()
export class MusicToPlaylist {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsRequiredStringColumn()
  public albumId: string;

  @IsRequiredStringColumn()
  public title: string;

  @IsOptionalNumberColumn({ default: 0 })
  public duration: number;

  @ManyToOne(() => Album, (Album) => Album.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  public album: Album;

  @OneToOne(() => File, (file) => file.ownerId, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  public file?: File;

  @ManyToOne(() => Music, (music) => music.musicToPlaylists)
  public music?: Music;

  @ManyToOne(() => Playlist, (playlist) => playlist.musicToPlaylists)
  public playlist?: Playlist;
}
