import { Body, Controller, HttpCode, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteApiResponse } from '../../common/decorators/requests/deleteApiResponse.decorator';
import { GetApiResponse } from '../../common/decorators/requests/getApiResponse.decorator';
import { PostApiResponse } from '../../common/decorators/requests/postApiResponse.decorator';
import { PutApiResponse } from '../../common/decorators/requests/putApiResponse.decorator';
import { UseCaseProxy } from '../../common/utils/usecase-proxy';
import { CreateRoleDTO, UpdateRoleDTO } from './dto/role.dto';
import { RolePresenter } from './dto/role.presenter';
import { Role } from './entities/role.entity';
import { RoleModule } from './role.module';
import {
  CreateRoleUseCase,
  DeleteRoleUseCase,
  FindAllRoleUseCase,
  FindOneRoleUseCase,
  UpdateRoleUseCase,
} from './use-cases';

@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(
    @Inject(RoleModule.GET_ROLES_USECASES_PROXY)
    private readonly findAllRoleUseCase: UseCaseProxy<FindAllRoleUseCase>,
    @Inject(RoleModule.GET_ROLE_USECASES_PROXY)
    private readonly findOneRoleUseCase: UseCaseProxy<FindOneRoleUseCase>,
    @Inject(RoleModule.POST_ROLE_USECASES_PROXY)
    private readonly createRoleUseCase: UseCaseProxy<CreateRoleUseCase>,
    @Inject(RoleModule.PUT_ROLE_USECASES_PROXY)
    private readonly updateRoleUseCase: UseCaseProxy<UpdateRoleUseCase>,
    @Inject(RoleModule.DELETE_ROLE_USECASES_PROXY)
    private readonly deleteRoleUseCase: UseCaseProxy<DeleteRoleUseCase>,
  ) {}

  @GetApiResponse(RolePresenter)
  public async findAll(): Promise<RolePresenter[]> {
    const roles = await this.findAllRoleUseCase.getInstance().execute();
    return roles.map((role) => new RolePresenter(role));
  }

  @GetApiResponse(RolePresenter, ':id')
  public async findOne(@Param('id') id: string): Promise<RolePresenter> {
    const role = await this.findOneRoleUseCase.getInstance().execute(id);
    return new RolePresenter(role);
  }

  @PostApiResponse(RolePresenter, '', false)
  public async create(@Body() role: CreateRoleDTO): Promise<RolePresenter> {
    const newRole: CreateRoleDTO = new CreateRoleDTO(role);
    return await this.createRoleUseCase.getInstance().execute(newRole);
  }

  @PutApiResponse(RolePresenter, '/:id')
  public async update(
    @Param('id') id: string,
    @Body() role: UpdateRoleDTO,
  ): Promise<RolePresenter> {
    const updatedRole = await this.updateRoleUseCase
      .getInstance()
      .execute(id, role);

    return new RolePresenter(updatedRole);
  }

  @HttpCode(204)
  @DeleteApiResponse('/:id')
  public async delete(@Param('id') id: string): Promise<Role> {
    return await this.deleteRoleUseCase.getInstance().execute(id);
  }
}
