import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsOptionalStringColumn } from '../../../common/decorators/columns/isOptionalStringColumn.decorator';
import { IsRequiredStringColumn } from '../../../common/decorators/columns/isRequiredStringColumn.decorator';
import { File } from '../../file/entities/file.entity';
import { Role } from '../../role/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsRequiredStringColumn()
  public username: string;

  @IsOptionalStringColumn()
  public email: string;

  @IsRequiredStringColumn()
  public password?: string;

  @CreateDateColumn()
  public createdAt?: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;

  @OneToOne(() => File, (file) => file.ownerId, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  public file?: File;

  @ManyToOne(() => Role, (Role) => Role.id)
  @JoinColumn({ name: 'roleId' })
  public role?: Role;

  @IsOptionalStringColumn()
  public roleId?: string;
}
