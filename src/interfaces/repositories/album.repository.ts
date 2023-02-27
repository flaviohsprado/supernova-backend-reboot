import {
  CreateAlbumDTO,
  UpdateAlbumDTO,
} from '../../modules/album/dto/album.dto';
import { Album } from '../../modules/album/entities/album.entity';

export interface IAlbumRepository {
  findAll(): Promise<Album[]>;
  findOne(id: string): Promise<Album>;
  create(album: CreateAlbumDTO): Promise<Album>;
  update(id: string, user: UpdateAlbumDTO): Promise<Album>;
  delete(id: string): Promise<Album>;
}
