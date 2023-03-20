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
    const cachedUser = await this.cacheManager.getCachedObject<UserPresenter>(
      'user',
    );

    if (cachedUser) return cachedUser;

    const user = await this.repository.findOne(id);

    if (!user)
      this.exceptionService.throwNotFoundException({
        message: 'User not found',
      });

    const userPresenter: UserPresenter = new UserPresenter(user);

    await this.cacheManager.setObjectInCache('user', user);

    return userPresenter;
  }
}
