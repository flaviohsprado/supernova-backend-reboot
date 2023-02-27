import { uuid } from 'uuidv4';
import { IsOptionalBoolean } from '../../../common/decorators/validators/isOptionalBoolean.decorator';
import { IsOptionalString } from '../../../common/decorators/validators/isOptionalString.decorator';
import { IsRequiredBoolean } from '../../../common/decorators/validators/isRequiredBoolean.decorator';
import { IsRequiredString } from '../../../common/decorators/validators/isRequiredString.decorator';
import { CreateFileDTO } from '../../../modules/file/dto/file.dto';

export class CreatePlaylistDTO {
  @IsOptionalString()
  public id?: string;

  @IsRequiredString()
  public userId: string;

  @IsRequiredString()
  public title: string;

  @IsRequiredBoolean()
  public isPublic: boolean;

  @IsOptionalString()
  public file?: CreateFileDTO;

  constructor(props: CreatePlaylistDTO) {
    Object.assign(this, props);
    this.id = uuid();
  }
}

export class UpdatePlaylistDTO {
  @IsOptionalString()
  public title?: string;

  @IsOptionalBoolean()
  public isPublic?: boolean;

  constructor(props: UpdatePlaylistDTO) {
    Object.assign(this, props);
  }
}
