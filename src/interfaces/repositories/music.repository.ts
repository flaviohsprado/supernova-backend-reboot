import {
  CreateMusicDTO,
  UpdateMusicDTO,
} from '../../modules/music/dto/music.dto';
import { Music } from '../../modules/music/entities/music.entity';

export interface IMusicRepository {
  findAll(): Promise<Music[]>;
  findOne(id: string): Promise<Music>;
  create(music: CreateMusicDTO): Promise<Music>;
  update(id: string, music: UpdateMusicDTO): Promise<Music>;
  delete(id: string): Promise<Music>;
}
