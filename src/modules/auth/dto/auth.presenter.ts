import { ApiProperty } from '@nestjs/swagger';

export class AuthPresenter {
  @ApiProperty()
  public accessToken: string;

  constructor(auth: AuthPresenter) {
    Object.assign(this, auth);
  }
}
