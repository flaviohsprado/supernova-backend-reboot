import { OwnerType } from 'src/enums/ownerType.enum';
import { IEnvironmentConfigService } from '../../../interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUploadService } from '../../../interfaces/abstracts/upload.interface';
import { IFileRepository } from '../../../interfaces/repositories/file.repository';
import { IMusicRepository } from '../../../interfaces/repositories/music.repository';
import { CreateFileDTO } from '../../../modules/file/dto/file.dto';
import { CreateMusicDTO } from '../dto/music.dto';
import { MusicPresenter } from '../dto/music.presenter';

export class CreateMusicUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IMusicRepository,
    private readonly fileRepository: IFileRepository,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: IEnvironmentConfigService,
  ) {}

  public async execute(
    music: CreateMusicDTO,
    file?: CreateFileDTO,
  ): Promise<MusicPresenter> {
    if (file) music.file = await this.createFile(music.id, file);

    await this.repository.create(music);

    this.logger.log(
      'CreateMusicUseCases execute()',
      'New music have been inserted',
    );

    return new MusicPresenter(await this.repository.findOne(music.id));
  }

  private async createFile(
    id: string,
    file: CreateFileDTO,
  ): Promise<CreateFileDTO> {
    let fileUploaded: CreateFileDTO = file;

    if (this.environmentConfig.getCloudUpload()) {
      fileUploaded = await this.uploadService.uploadFile(file);
    }

    return await this.fileRepository.create(fileUploaded, id, OwnerType.MUSIC);
  }
}
