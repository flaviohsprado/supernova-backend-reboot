import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsRequiredStringColumn } from '../../../common/decorators/columns/isRequiredStringColumn.decorator';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsRequiredStringColumn()
  name: string;

  @IsRequiredStringColumn()
  permissions: string;

  @OneToMany(() => User, (User) => User.role)
  users?: User[];
}
