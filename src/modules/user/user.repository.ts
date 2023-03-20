import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../interfaces/repositories/user.repository';
import { CreateUserDTO } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  public async findByKey(key: string, value: string): Promise<User> {
    return await this.repository.findOne({
      where: { [key]: value },
      relations: ['file', 'role'],
    });
  }

  public async findAll(): Promise<User[]> {
    return await this.repository.find({
      relations: ['file', 'role'],
    });
  }

  public async findOne(id: string): Promise<User> {
    return await this.repository.findOne({
      where: { id },
      relations: ['file', 'role'],
    });
  }

  public async create(user: CreateUserDTO): Promise<User> {
    const newUser = await this.repository.create(user);
    return this.repository.save(newUser);
  }

  public async update(id: string, user: User): Promise<User> {
    await this.repository.save({ ...user, id });
    return await this.repository.findOne({ where: { id } });
  }

  public async delete(id: string): Promise<any> {
    const user = await this.repository.findOne({ where: { id } });

    if (user) {
      await this.repository.delete(id);
      return user;
    }
  }

  public async alreadyExists(
    key: string,
    value: string,
    id?: string,
  ): Promise<boolean> {
    if (!value) return false;

    const alreadyExists: User = await this.repository.findOne({
      where: { [key]: value },
    });

    if (alreadyExists && alreadyExists.id !== id) return true;

    return false;
  }
}
