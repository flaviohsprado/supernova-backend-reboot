import { HttpStatus } from '@nestjs/common';
import { IBcryptService } from '../../../interfaces/abstracts/bcrypt.interface';
import { IExceptionService } from '../../../interfaces/abstracts/exceptions.interface';
import { ILogger } from '../../../interfaces/abstracts/logger.interface';
import { IUserRepository } from '../../../interfaces/repositories/user.repository';
import { UpdateUserDTO } from '../dto/user.dto';
import { User } from '../entities/user.entity';

export class UpdateUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly bcryptService: IBcryptService,
    private readonly exceptionService: IExceptionService,
  ) {}

  public async execute(id: string, user: UpdateUserDTO): Promise<User> {
    if (await this.repository.alreadyExists('email', user.email, id))
      this.exceptionService.throwForbiddenException({
        message: 'Email already exists in app!',
        statusCode: HttpStatus.FORBIDDEN,
      });

    if (user.password) {
      user.password = await this.bcryptService.createHash(user.password);
    } else {
      delete user.password;
    }

    const updatedUser = await this.repository.update(id, user);

    this.logger.log(
      'UpdateUserUseCases execute()',
      `User ${id} have been updated`,
    );

    return updatedUser;
  }
}
