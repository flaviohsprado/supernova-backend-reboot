import { uuid } from 'uuidv4';
import { IsOptionalNumber } from '../../../common/decorators/validators/isOptionalNumber.decorator';
import { IsOptionalString } from '../../../common/decorators/validators/isOptionalString.decorator';
import { IsRequiredNumber } from '../../../common/decorators/validators/isRequiredNumber.decorator';
import { IsRequiredString } from '../../../common/decorators/validators/isRequiredString.decorator';
import { CreateFileDTO } from '../../../modules/file/dto/file.dto';

export class CreateMusicDTO {
  @IsOptionalString()
  public id?: string;

  @IsRequiredString()
  public albumId: string;

  @IsRequiredString()
  public title: string;

  @IsRequiredNumber()
  public duration: number;

  @IsOptionalString()
  public file?: CreateFileDTO;

  constructor(props: CreateMusicDTO) {
    Object.assign(this, props);
    this.id = uuid();
  }
}

export class UpdateMusicDTO {
  @IsOptionalString()
  public albumId?: string;

  @IsOptionalString()
  public title?: string;

  @IsOptionalNumber()
  public duration?: number;

  @IsOptionalString()
  public file?: CreateFileDTO;

  constructor(props: UpdateMusicDTO) {
    Object.assign(this, props);
  }
}
