import { Body, Controller, HttpCode, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/isPublicRoute.decorator';
import { DeleteApiResponse } from '../../common/decorators/requests/deleteApiResponse.decorator';
import { GetApiResponse } from '../../common/decorators/requests/getApiResponse.decorator';
import { PostApiResponse } from '../../common/decorators/requests/postApiResponse.decorator';
import { PutApiResponse } from '../../common/decorators/requests/putApiResponse.decorator';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUserUseCase,
  FindOneUserUseCase,
  UpdateUserUseCase,
} from './use-cases';

import { Inject } from '@nestjs/common/decorators';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { UserPresenter } from './dto/user.presenter';
import { User } from './entities/user.entity';
import { UserModule } from './user.module';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    @Inject(UserModule.GET_USERS_USECASES_PROXY)
    private readonly findAllUserUseCase: FindAllUserUseCase,
    @Inject(UserModule.GET_USER_USECASES_PROXY)
    private readonly findOneUserUseCase: FindOneUserUseCase,
    @Inject(UserModule.POST_USER_USECASES_PROXY)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(UserModule.PUT_USER_USECASES_PROXY)
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject(UserModule.DELETE_USER_USECASES_PROXY)
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @GetApiResponse(UserPresenter)
  public async findAll(): Promise<UserPresenter[]> {
    const users = await this.findAllUserUseCase.execute();
    return users.map((user) => new UserPresenter(user));
  }

  @GetApiResponse(UserPresenter, ':id')
  public async findOne(@Param('id') id: string): Promise<UserPresenter> {
    const user = await this.findOneUserUseCase.execute(id);
    return new UserPresenter(user);
  }

  @Public()
  @PostApiResponse(UserPresenter, '', false)
  public async create(@Body() user: CreateUserDTO): Promise<UserPresenter> {
    const createdUser = await this.createUserUseCase.execute(user);

    return new UserPresenter(createdUser);
  }

  @PutApiResponse(UserPresenter, '/:id')
  public async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDTO,
  ): Promise<UserPresenter> {
    const updatedUser = await this.updateUserUseCase.execute(id, user);

    return new UserPresenter(updatedUser);
  }

  @HttpCode(204)
  @DeleteApiResponse('/:id')
  public async delete(@Param('id') id: string): Promise<User> {
    return await this.deleteUserUseCase.execute(id);
  }
}
