import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    super();

    this.logger = new Logger('AllExceptionsFilter');
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error(exception);

    const status =
      exception?.status ||
      exception?.statusCode ||
      exception?.response?.statusCode ||
      exception?.response?.status ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Sorry we are experiencing technical problems.'
        : exception.response?.message || '';

    console.log('exception', exception);

    const error =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Sorry we are experiencing technical problems.'
        : exception.message.error ||
          exception.response.error ||
          exception.response.message ||
          exception.response.data.message ||
          '';

    response.status(status).json({
      status,
      message,
      error,
    });
  }
}
