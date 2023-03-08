import {
  Body,
  Controller,
  Inject,
  Req,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../../common/decorators/isPublicRoute.decorator';
import { GetApiResponse } from '../../common/decorators/requests/getApiResponse.decorator';
import { PostApiResponse } from '../../common/decorators/requests/postApiResponse.decorator';
import { UseCaseProxy } from '../../common/utils/usecase-proxy';
import { AuthModule } from './auth.module';
import { AuthDTO } from './dto/auth.dto';
import { AuthPresenter } from './dto/auth.presenter';
import { LoginUseCase } from './use-cases/login.usecase';
import { RefreshTokenUseCase } from './use-cases/refreshToken.usecase';

@ApiTags('Authentication')
@Controller('/public/auth')
@SerializeOptions({
  strategy: 'exposeAll',
})
export class AuthController {
  constructor(
    @Inject(AuthModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCase: UseCaseProxy<LoginUseCase>,
    @Inject(AuthModule.REFRESH_TOKEN_USECASES_PROXY)
    private readonly refreshTokenUseCase: UseCaseProxy<RefreshTokenUseCase>,
  ) {}

  @Public()
  @PostApiResponse(AuthPresenter, '/login')
  public async login(@Body() credentials: AuthDTO): Promise<AuthPresenter> {
    const authCredentials = new AuthDTO(credentials);
    return this.loginUseCase.getInstance().execute(authCredentials);
  }

  @Public()
  @GetApiResponse(AuthPresenter, '/refresh')
  public async refresh(@Req() request: Request): Promise<AuthPresenter> {
    return this.refreshTokenUseCase
      .getInstance()
      .execute(request.headers.authorization);
  }
}
