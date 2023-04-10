import { ICacheManager } from '../../../interfaces/abstracts/cache.interface';
import { IUserRepository } from '../../../interfaces/repositories/user.repository';
import { UserPresenter } from '../dto/user.presenter';

export class FindAllUserUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly cacheManager: ICacheManager,
  ) {}

  public async execute(): Promise<UserPresenter[]> {
    const cachedUsers = await this.cacheManager.getCachedObject<
      UserPresenter[]
    >('users');

    if (cachedUsers) return cachedUsers;

    const users = await this.repository.findAll();

    if (!users) return undefined;

    const userPresenter: UserPresenter[] = users.map(
      (user) => new UserPresenter(user),
    );

    await this.cacheManager.setObjectInCache('users', userPresenter);

    return userPresenter;
  }
}
