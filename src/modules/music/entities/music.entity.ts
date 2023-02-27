import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsOptionalNumberColumn } from '../../../common/decorators/columns/isOptionalnumberColumn.decorator';
import { IsRequiredStringColumn } from '../../../common/decorators/columns/isRequiredStringColumn.decorator';
import { Album } from '../../../modules/album/entities/album.entity';
import { File } from '../../../modules/file/entities/file.entity';
import { MusicToPlaylist } from './musicToPlaylist.entity';

@Entity()
export class Music {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsRequiredStringColumn()
  public albumId: string;

  @IsRequiredStringColumn()
  public title: string;

  @IsOptionalNumberColumn({ default: 0 })
  public duration: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

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

  @OneToMany(() => MusicToPlaylist, (musicToPlaylist) => musicToPlaylist.music)
  public musicToPlaylists: MusicToPlaylist[];
}
