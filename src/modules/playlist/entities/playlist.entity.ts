import { IsRequiredBooleanColumn } from 'src/common/decorators/columns/isRequiredBooleanColumn.decorator';
import { IsRequiredStringColumn } from 'src/common/decorators/columns/isRequiredStringColumn.decorator';
import { File } from 'src/modules/file/entities/file.entity';
import { MusicToPlaylist } from 'src/modules/music/entities/musicToPlaylist.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsRequiredStringColumn()
  public userId?: string;

  @IsRequiredStringColumn()
  public title: string;

  @IsRequiredBooleanColumn()
  public isPublic: boolean;

  @ManyToOne(() => User, (User) => User.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  public user: User;

  //TODO: Add addedAt column to PlaylistMusic table
  /*@ManyToMany(() => Music, { cascade: ['update'], nullable: true })
  @JoinTable()
  public musics?: Music[];*/

  @OneToOne(() => File, (file) => file.ownerId, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  public file?: File;

  @OneToMany(
    () => MusicToPlaylist,
    (musicToPlaylist) => musicToPlaylist.playlist,
    {
      cascade: ['update'],
      nullable: true,
    },
  )
  public musicToPlaylists: MusicToPlaylist[];
}
