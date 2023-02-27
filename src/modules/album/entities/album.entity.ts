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
import { IsRequiredDateColumn } from '../../../common/decorators/columns/isRequiredDateColumn.decorator';
import { IsRequiredNumberColumn } from '../../../common/decorators/columns/isRequiredNumberColumn.decorator';
import { IsRequiredStringColumn } from '../../../common/decorators/columns/isRequiredStringColumn.decorator';
import { Artist } from '../../../modules/artist/entities/artist.entity';
import { File } from '../../../modules/file/entities/file.entity';
import { Music } from '../../../modules/music/entities/music.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsRequiredStringColumn()
  public artistId: string;

  @IsRequiredStringColumn()
  public title: string;

  //public numberOfSongs: number

  @IsRequiredNumberColumn()
  public duration: number;

  /*@Expose({ name: 'total' })
    @ApiProperty({ type: 'number' })
    public get numberOfSongs(): number {
      return this.songs?.reduce((value, song) => value + song.total, 0) || 0;
    }*/

  @IsRequiredDateColumn({ nullable: true })
  public releaseDate: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => Artist, (Artist) => Artist.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  public artist: Artist;

  @OneToMany(() => Music, (Music) => Music.album, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  public musics?: Music[];

  @OneToOne(() => File, (file) => file.ownerId, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  public file?: File;
}
