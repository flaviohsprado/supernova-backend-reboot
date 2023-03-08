import { Body, Controller, HttpCode, Param } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import {
  Req,
  UploadedFile,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/isPublicRoute.decorator';
import { DeleteApiResponse } from '../../common/decorators/requests/deleteApiResponse.decorator';
import { GetApiResponse } from '../../common/decorators/requests/getApiResponse.decorator';
import { PostApiResponse } from '../../common/decorators/requests/postApiResponse.decorator';
import { PutApiResponse } from '../../common/decorators/requests/putApiResponse.decorator';
import { FileUtils } from '../../common/utils/file.utils';
import { UseCaseProxy } from '../../common/utils/usecase-proxy';
import { IAuthRequest } from '../../interfaces/authRequest.interface';
import { CreateFileDTO } from '../file/dto/file.dto';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { UserPresenter } from './dto/user.presenter';
import { User } from './entities/user.entity';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUserUseCase,
  FindOneUserUseCase,
  UpdateUserFileUseCase,
  UpdateUserUseCase,
} from './use-cases';
import { UserModule } from './user.module';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    @Inject(UserModule.GET_USERS_USECASES_PROXY)
    private readonly findAllUserUseCase: UseCaseProxy<FindAllUserUseCase>,
    @Inject(UserModule.GET_USER_USECASES_PROXY)
    private readonly findOneUserUseCase: UseCaseProxy<FindOneUserUseCase>,
    @Inject(UserModule.POST_USER_USECASES_PROXY)
    private readonly createUserUseCase: UseCaseProxy<CreateUserUseCase>,
    @Inject(UserModule.PUT_USER_USECASES_PROXY)
    private readonly updateUserUseCase: UseCaseProxy<UpdateUserUseCase>,
    @Inject(UserModule.PUT_USER_FILE_USECASES_PROXY)
    private readonly updateUserFileUseCase: UseCaseProxy<UpdateUserFileUseCase>,
    @Inject(UserModule.DELETE_USER_USECASES_PROXY)
    private readonly deleteUserUseCase: UseCaseProxy<DeleteUserUseCase>,
  ) {}

  @GetApiResponse(UserPresenter, '/me')
  public async findUser(@Req() request: IAuthRequest): Promise<UserPresenter> {
    return await this.findOneUserUseCase.getInstance().execute(request.user.id);
  }

  @GetApiResponse(UserPresenter)
  public async findAll(): Promise<UserPresenter[]> {
    const users = await this.findAllUserUseCase.getInstance().execute();
    return users.map((user) => (user = new UserPresenter({ ...user })));
  }

  @GetApiResponse(UserPresenter, ':id')
  public async findOne(@Param('id') id: string): Promise<UserPresenter> {
    const user = await this.findOneUserUseCase.getInstance().execute(id);
    return new UserPresenter(user);
  }

  @Public()
  @PostApiResponse(UserPresenter, '', false)
  public async create(
    @Body() user: CreateUserDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserPresenter> {
    const newFile: CreateFileDTO = await FileUtils.createFile(file);
    const newUser: CreateUserDTO = new CreateUserDTO(user);
    return await this.createUserUseCase.getInstance().execute(newUser, newFile);
  }

  @PutApiResponse(UserPresenter, '/:id')
  public async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDTO,
  ): Promise<UserPresenter> {
    const updatedUser = await this.updateUserUseCase
      .getInstance()
      .execute(id, user);

    return new UserPresenter(updatedUser);
  }

  @PutApiResponse(UserPresenter, '/:id/avatar')
  public async updateUserFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserPresenter> {
    const newFile: CreateFileDTO = await FileUtils.createFile(file);
    return await this.updateUserFileUseCase.getInstance().execute(id, newFile);
  }

  @HttpCode(204)
  @DeleteApiResponse('/:id')
  public async delete(@Param('id') id: string): Promise<User> {
    return await this.deleteUserUseCase.getInstance().execute(id);
  }
}
