import { IsRequiredString } from '../../../common/decorators/validators/isRequiredString.decorator';

export class CreateArtistDTO {
  @IsRequiredString()
  public name: string;
}

export class UpdateArtistDTO {
  @IsRequiredString()
  public name: string;
}
