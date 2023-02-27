import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMusicRepository } from '../../interfaces/repositories/music.repository';
import { CreateMusicDTO, UpdateMusicDTO } from './dto/music.dto';
import { Music } from './entities/music.entity';

export class MusicRepository implements IMusicRepository {
  constructor(
    @InjectRepository(Music)
    private readonly repository: Repository<Music>,
  ) {}

  public async findAll(): Promise<Music[]> {
    return await this.repository.find({ relations: ['album', 'file'] });
  }

  public async findOne(id: string): Promise<Music> {
    return await this.repository.findOne({
      where: { id },
      relations: ['album', 'file'],
    });
  }

  public async create(music: CreateMusicDTO): Promise<Music> {
    const newMusic = this.repository.create(music);
    return await this.repository.save(newMusic);
  }

  public async update(id: string, music: UpdateMusicDTO): Promise<Music> {
    const newMusic = this.repository.create({ ...music, id });
    return await this.repository.save(newMusic);
  }

  public async delete(id: string): Promise<Music> {
    const music = await this.repository.findOne({ where: { id } });

    if (music) {
      this.repository.delete(id);
      return music;
    }
  }
}
