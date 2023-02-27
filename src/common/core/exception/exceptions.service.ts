import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IExceptionService,
  IFormatExceptionMessage,
} from '../../../interfaces/abstracts/exceptions.interface';

@Injectable()
export class ExceptionsService implements IExceptionService {
  throwBadRequestException(data: IFormatExceptionMessage): void {
    throw new BadRequestException(data);
  }

  throwInternalServerErrorException(data?: IFormatExceptionMessage): void {
    throw new InternalServerErrorException(data);
  }

  throwForbiddenException(data?: IFormatExceptionMessage): void {
    throw new ForbiddenException(data);
  }

  throwUnauthorizedException(data?: IFormatExceptionMessage): void {
    throw new UnauthorizedException(data);
  }

  throwNotFoundException(data?: IFormatExceptionMessage): void {
    throw new NotFoundException(data);
  }
}
