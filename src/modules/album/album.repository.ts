import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAlbumRepository } from '../../interfaces/repositories/album.repository';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumRepository implements IAlbumRepository {
  constructor(
    @InjectRepository(Album)
    private readonly albumEntityRepository: Repository<Album>,
  ) {}

  public async findAll(): Promise<Album[]> {
    return this.albumEntityRepository.find({
      relations: ['artist', 'musics', 'musics.file', 'file'],
    });
  }

  public async findOne(id: string): Promise<Album> {
    return await this.albumEntityRepository.findOne({
      where: { id },
      relations: ['artist', 'musics', 'musics.file', 'file'],
    });
  }

  public async create(album: Album): Promise<Album> {
    const newAlbum = this.albumEntityRepository.create(album);
    return this.albumEntityRepository.save(newAlbum);
  }

  public async update(id: string, album: Album): Promise<Album> {
    const updateAlbum = this.albumEntityRepository.create({ ...album, id });
    return this.albumEntityRepository.save(updateAlbum);
  }

  public async delete(id: string): Promise<any> {
    const user = await this.albumEntityRepository.findOne({ where: { id } });

    if (user) {
      this.albumEntityRepository.delete(id);
      return user;
    }
  }
}
