import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsOptionalNumberColumn } from '../../../common/decorators/columns/isOptionalnumberColumn.decorator';
import { IsRequiredStringColumn } from '../../../common/decorators/columns/isRequiredStringColumn.decorator';
import { Album } from '../../../modules/album/entities/album.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsRequiredStringColumn()
  public name: string;

  @IsOptionalNumberColumn({ default: 0 })
  public monthlyListeners: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => Album, (album) => album.artist, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  public albums?: Album[];
}
