import { CreateRoleDTO, UpdateRoleDTO } from '../../modules/role/dto/role.dto';
import { Role } from '../../modules/role/entities/role.entity';

export interface IRoleRepository {
  findAll?(): Promise<Role[]>;
  findOne?(id: string): Promise<Role>;
  create?(user: CreateRoleDTO): Promise<Role>;
  update?(id: string, user: UpdateRoleDTO): Promise<Role>;
  delete?(id: string): Promise<Role>;
}
