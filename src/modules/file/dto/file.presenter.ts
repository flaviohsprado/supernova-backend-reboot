import { ApiProperty } from '@nestjs/swagger';

export class FilePresenter {
  @ApiProperty()
  public fieldname?: string;

  @ApiProperty()
  public originalname?: string;

  @ApiProperty()
  public buffer?: Uint8Array;

  @ApiProperty()
  public encoding?: string;

  @ApiProperty()
  public mimetype?: string;

  @ApiProperty()
  public url?: string;

  @ApiProperty()
  public key?: string;

  constructor(props: FilePresenter) {
    Object.assign(this, props);
  }
}
