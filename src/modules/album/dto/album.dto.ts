import { uuid } from 'uuidv4';
import { IsOptionalString } from '../../../common/decorators/validators/isOptionalString.decorator';
import { IsRequiredDate } from '../../../common/decorators/validators/isRequiredDate.decorator';
import { IsRequiredString } from '../../../common/decorators/validators/isRequiredString.decorator';
import { CreateFileDTO } from '../../../modules/file/dto/file.dto';

export class CreateAlbumDTO {
  @IsOptionalString()
  public id?: string;

  @IsRequiredString()
  public artistId: string;

  @IsRequiredString()
  public title: string;

  @IsRequiredDate()
  public releaseDate: Date;

  @IsOptionalString()
  public file?: CreateFileDTO;

  constructor(props: CreateAlbumDTO) {
    Object.assign(this, props);
    this.id = uuid();
  }
}

export class UpdateAlbumDTO {
  @IsRequiredString()
  public title: string;

  constructor(props: UpdateAlbumDTO) {
    Object.assign(this, props);
  }
}
