import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRoleRepository } from '../../interfaces/repositories/role.repository';
import { CreateRoleDTO, UpdateRoleDTO } from './dto/role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}

  public async findAll(): Promise<Role[]> {
    return await this.repository.find();
  }

  public async findOne(id: string): Promise<Role> {
    return await this.repository.findOne({ where: { id } });
  }

  public async create(createRoleDto: CreateRoleDTO): Promise<Role> {
    return await this.repository.save(createRoleDto);
  }

  public async update(id: string, updateRoleDto: UpdateRoleDTO): Promise<Role> {
    return await this.repository.save({ id, ...updateRoleDto });
  }

  public async delete(id: string): Promise<Role> {
    const role = await this.repository.findOne({ where: { id } });

    if (role) {
      this.repository.delete(id);
      return role;
    }
  }
}
