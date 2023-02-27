import { IsOptionalString } from '../../../common/decorators/validators/isOptionalString.decorator';

export class CreateFileDTO {
  @IsOptionalString()
  ownerId?: string;

  @IsOptionalString()
  ownerType?: string;

  @IsOptionalString()
  fieldname?: string;

  @IsOptionalString()
  originalname?: string;

  @IsOptionalString()
  encoding?: string;

  @IsOptionalString()
  mimetype?: string;

  @IsOptionalString()
  key?: string;

  @IsOptionalString()
  url?: string;

  @IsOptionalString()
  buffer?: Uint8Array;

  constructor(props: CreateFileDTO) {
    Object.assign(this, props);
  }
}
