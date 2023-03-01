import { Body, Controller, Inject } from '@nestjs/common';
import { Public } from '../../common/decorators/isPublicRoute.decorator';
import { PostApiResponse } from '../../common/decorators/requests/postApiResponse.decorator';
import { UseCaseProxy } from '../../common/utils/usecase-proxy';
import { AuthModule } from './auth.module';
import { AuthDTO } from './dto/auth.dto';
import { AuthPresenter } from './dto/auth.presenter';
import { LoginUseCase } from './use-cases/login.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCase: UseCaseProxy<LoginUseCase>,
  ) {}

  @Public()
  @PostApiResponse(AuthPresenter, '/login')
  public async login(@Body() credentials: AuthDTO): Promise<AuthPresenter> {
    const authCredentials = new AuthDTO(credentials);
    return this.loginUseCase.getInstance().execute(authCredentials);
  }
}
