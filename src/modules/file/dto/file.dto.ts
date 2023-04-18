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
    this.ownerId = props.ownerId;
    this.ownerType = props.ownerType;
    this.fieldname = props.fieldname;
    this.originalname = props.originalname;
    this.encoding = props.encoding;
    this.mimetype = props.mimetype;
    this.key = props.key;
    this.url = props.url;
    this.buffer = props.buffer;
  }
}
