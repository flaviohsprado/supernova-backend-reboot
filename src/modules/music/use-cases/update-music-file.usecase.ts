import { OwnerType } from '../../../enums/ownerType.enum';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { IMusicRepository } from '../../../interfaces/repositories/music.repository';
import { CreateFileDTO } from '../../../modules/file/dto/file.dto';
import { Music } from '../entities/music.entity';

export class UpdateMusicFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IMusicRepository,
    private readonly fileRepository: IFileRepository,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
  ) {}

  public async execute(id: string, file?: CreateFileDTO): Promise<Music> {
    let fileUploaded: CreateFileDTO = file;

    const music = await this.repository.findOne(id);

    const musicFile = await this.fileRepository.findOne(id, OwnerType.MUSIC);

    if (this.environmentConfig.getCloudUpload()) {
      if (musicFile) await this.uploadService.deleteFile([musicFile.key]);
      fileUploaded = await this.uploadService.uploadFile(file);
    }

    if (musicFile) await this.fileRepository.delete(id, OwnerType.MUSIC);

    music.file = await this.fileRepository.update(
      fileUploaded,
      id,
      OwnerType.MUSIC,
    );

    const updatedMusic = await this.repository.update(id, music);

    this.logger.log(
      'UpdateMusicFileUseCases execute()',
      `File ${fileUploaded.originalname} have been updated`,
    );

    return updatedMusic;
  }
}
