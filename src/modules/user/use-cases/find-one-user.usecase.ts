import { HttpStatus } from '@nestjs/common';
import { ICacheManager } from '../../../interfaces/abstracts/cache.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { IUserRepository } from '../../../interfaces/repositories/user.repository';
import { UserPresenter } from '../dto/user.presenter';

export class FindOneUserUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly exceptionService: IExceptionService,
    private readonly cacheManager: ICacheManager,
  ) {}

  public async execute(id: string): Promise<UserPresenter> {
    const cachedUser: UserPresenter =
      await this.cacheManager.getCachedObject<UserPresenter>('user');

    if (cachedUser && cachedUser.id === id) return cachedUser;

    const user = await this.repository.findOne(id);

    if (!user) {
      this.exceptionService.throwNotFoundException({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      });

      return;
    }

    const userPresenter: UserPresenter = new UserPresenter(user);

    await this.cacheManager.setObjectInCache('user', user);

    return userPresenter;
  }
}
